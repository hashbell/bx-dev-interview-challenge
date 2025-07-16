import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3StorageService } from './s3-storage.service';
import { IStorageService } from '@/shared/interfaces/storage.interface';
import { FileStreamData } from '@files/types/file-stream.types';
import { CreateBucketCommand } from '@/commands/create-bucket.command';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

jest.mock('@/commands/create-bucket.command', () => ({
  CreateBucketCommand: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('S3StorageService', () => {
  let service: IStorageService;
  let configService: jest.Mocked<ConfigService>;
  let mockS3Client: jest.MockedClass<typeof S3Client>;
  let mockGetSignedUrl: jest.MockedFunction<typeof getSignedUrl>;
  let mockS3Instance: any;
  let mockPutObjectCommand: jest.MockedClass<typeof PutObjectCommand>;
  let mockGetObjectCommand: jest.MockedClass<typeof GetObjectCommand>;
  let mockListObjectsV2Command: jest.MockedClass<typeof ListObjectsV2Command>;

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test-document.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1024000,
    stream: {} as any,
    destination: '',
    filename: '',
    path: '',
    buffer: Buffer.from('test content'),
  };

  const mockS3Config = {
    endpoint: 'http://localhost:9000',
    accessKeyId: 'test-access-key',
    secretAccessKey: 'test-secret-key',
    bucketName: 'test-bucket',
    region: 'us-east-1',
  };

  const mockFileStreamData: FileStreamData = {
    stream: {} as any,
    contentType: 'application/pdf',
    contentLength: 1024000,
  };

  beforeEach(async () => {
    // Create mock S3 instance
    mockS3Instance = {
      send: jest.fn(),
    };

    // Mock the S3Client constructor to return our mock instance
    mockS3Client = S3Client as jest.MockedClass<typeof S3Client>;
    mockS3Client.mockImplementation(() => mockS3Instance);

    // Mock the command constructors
    mockPutObjectCommand = PutObjectCommand as jest.MockedClass<typeof PutObjectCommand>;
    mockGetObjectCommand = GetObjectCommand as jest.MockedClass<typeof GetObjectCommand>;
    mockListObjectsV2Command = ListObjectsV2Command as jest.MockedClass<typeof ListObjectsV2Command>;

    // Mock command constructors to return objects with input property
    mockPutObjectCommand.mockImplementation((params) => ({ input: params }) as any);
    mockGetObjectCommand.mockImplementation((params) => ({ input: params }) as any);
    mockListObjectsV2Command.mockImplementation((params) => ({ input: params }) as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const configMap: Record<string, string> = {
                S3_ENDPOINT: mockS3Config.endpoint,
                S3_ACCESS_KEY_ID: mockS3Config.accessKeyId,
                S3_SECRET_ACCESS_KEY: mockS3Config.secretAccessKey,
                S3_BUCKET_NAME: mockS3Config.bucketName,
                S3_REGION: mockS3Config.region,
              };
              return configMap[key];
            }),
          },
        },
        {
          provide: CreateBucketCommand,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<IStorageService>(S3StorageService);
    configService = module.get(ConfigService);
    mockGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize S3 client with correct configuration', () => {
      expect(mockS3Client).toHaveBeenCalledWith({
        region: mockS3Config.region,
        endpoint: mockS3Config.endpoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId: mockS3Config.accessKeyId,
          secretAccessKey: mockS3Config.secretAccessKey,
        },
      });
    });
  });

  describe('uploadFile', () => {
    const key = 'test-file-key';
    const mimetype = 'application/pdf';

    it('should successfully upload a file to S3', async () => {
      mockS3Instance.send.mockResolvedValue({});

      const result = await service.uploadFile(mockFile, key, mimetype);

      expect(mockPutObjectCommand).toHaveBeenCalledWith({
        Bucket: mockS3Config.bucketName,
        Key: key,
        Body: mockFile.buffer,
        ContentType: mimetype,
        ACL: 'private',
        Metadata: {
          originalName: mockFile.originalname,
        },
      });
      expect(result).toBe(key);
    });

    it('should throw InternalServerErrorException when S3 upload fails', async () => {
      mockS3Instance.send.mockRejectedValue(new Error('S3 upload failed'));

      await expect(service.uploadFile(mockFile, key, mimetype)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getFileStream', () => {
    const key = 'test-file-key';

    it('should successfully get file stream from S3', async () => {
      const mockResponse = {
        Body: mockFileStreamData.stream,
        ContentType: mockFileStreamData.contentType,
        ContentLength: mockFileStreamData.contentLength,
      };
      mockS3Instance.send.mockResolvedValue(mockResponse);

      const result = await service.getFileStream(key);

      expect(mockGetObjectCommand).toHaveBeenCalledWith({
        Bucket: mockS3Config.bucketName,
        Key: key,
      });
      expect(result).toEqual(mockFileStreamData);
    });

    it('should throw InternalServerErrorException when file not found', async () => {
      mockS3Instance.send.mockRejectedValue(new Error('NoSuchKey'));

      await expect(service.getFileStream(key)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getPresignedUrl', () => {
    const key = 'test-file-key';
    const mockPresignedUrl = 'https://s3.amazonaws.com/bucket/file-key?X-Amz-Algorithm=AWS4-HMAC-SHA256&...';

    it('should successfully generate presigned URL', async () => {
      mockGetSignedUrl.mockResolvedValue(mockPresignedUrl);

      const result = await service.getPresignedUrl(key);

      expect(mockGetObjectCommand).toHaveBeenCalledWith({
        Bucket: mockS3Config.bucketName,
        Key: key,
      });
      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        mockS3Instance,
        expect.objectContaining({
          input: {
            Bucket: mockS3Config.bucketName,
            Key: key,
          },
        }),
        { expiresIn: 60 }
      );
      expect(result).toBe(mockPresignedUrl);
    });

    it('should throw InternalServerErrorException when presigned URL generation fails', async () => {
      mockGetSignedUrl.mockImplementation(() => {
        throw new Error('Failed to generate presigned URL');
      });

      await expect(service.getPresignedUrl(key)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('listFiles', () => {
    it('should successfully list files from S3', async () => {
      const mockS3Objects = [
        {
          Key: 'file1.pdf',
          Size: 1024000,
          LastModified: new Date('2024-01-15T10:30:00.000Z'),
        },
      ];
      const mockResponse = {
        Contents: mockS3Objects,
      };
      mockS3Instance.send.mockResolvedValue(mockResponse);

      const result = await service.listFiles();

      expect(mockListObjectsV2Command).toHaveBeenCalledWith({
        Bucket: mockS3Config.bucketName,
      });
      expect(result).toEqual([
        {
          key: 'file1.pdf',
          size: 1024000,
          lastModified: new Date('2024-01-15T10:30:00.000Z'),
        },
      ]);
    });

    it('should return empty array when no files exist', async () => {
      const mockResponse = {
        Contents: [],
      };
      mockS3Instance.send.mockResolvedValue(mockResponse);

      const result = await service.listFiles();

      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException when S3 list operation fails', async () => {
      mockS3Instance.send.mockRejectedValue(new Error('S3 list failed'));

      await expect(service.listFiles()).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
}); 
