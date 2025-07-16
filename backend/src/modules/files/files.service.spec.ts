const mockUuid = '550e8400-e29b-41d4-a716-446655440000';
jest.mock('uuid', () => ({
  v4: jest.fn(() => mockUuid),
}));

import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { IFilesService, FILES_SERVICE } from './files.service.interface';
import { FILE_SERVICE, FILE_REPOSITORY, IStorageService, IFileRepository } from '@/shared/interfaces/storage.interface';
import { FileEntity } from '@/database/entities/file.entity';
import { FileStreamData } from '@files/types/file-stream.types';
import { FileResponseDto } from '@files/dto/file.dto';

describe('FilesService', () => {
  let service: IFilesService;
  let storageService: jest.Mocked<IStorageService>;
  let fileRepository: jest.Mocked<IFileRepository>;

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

  const mockFileEntity: FileEntity = {
    id: 1,
    key: mockUuid,
    filename: 'test-document.pdf',
    size: 1024000,
    mimetype: 'application/pdf',
    uploadedBy: 1,
    uploadedAt: new Date('2024-01-15T10:30:00.000Z'),
    user: undefined,
  };

  const mockFileResponse: FileResponseDto = {
    id: 1,
    key: mockUuid,
    filename: 'test-document.pdf',
    size: 1024000,
    mimetype: 'application/pdf',
    uploadedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  const mockFileStreamData: FileStreamData = {
    stream: {} as any,
    contentType: 'application/pdf',
    contentLength: 1024000,
  };

  beforeEach(async () => {
    (uuidv4 as jest.Mock).mockClear();
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FILES_SERVICE,
          useClass: FilesService,
        },
        {
          provide: FILE_SERVICE,
          useValue: {
            uploadFile: jest.fn(),
            getFileStream: jest.fn(),
            getPresignedUrl: jest.fn(),
            generatePresignedUrlForUpload: jest.fn(),
            listFiles: jest.fn(),
          },
        },
        {
          provide: FILE_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUser: jest.fn(),
            findByKey: jest.fn(),
            deleteByKey: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IFilesService>(FILES_SERVICE);
    storageService = module.get(FILE_SERVICE);
    fileRepository = module.get(FILE_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    const userId = 1;

    it('should successfully upload a file and return file response', async () => {
      const fileKey = mockUuid;
      storageService.uploadFile.mockResolvedValue(fileKey);
      fileRepository.create.mockResolvedValue(mockFileEntity);

      const result = await service.uploadFile(mockFile, userId);

      expect(uuidv4).toHaveBeenCalled();
      expect(storageService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        fileKey,
        mockFile.mimetype,
      );
      expect(fileRepository.create).toHaveBeenCalledWith({
        key: fileKey,
        filename: mockFile.originalname,
        size: mockFile.size,
        mimetype: mockFile.mimetype,
        uploadedBy: userId,
      });
      expect(result).toEqual(mockFileResponse);
    });

    it('should handle storage service upload errors', async () => {
      storageService.uploadFile.mockRejectedValue(new Error('Storage upload failed'));

      await expect(service.uploadFile(mockFile, userId)).rejects.toThrow('Storage upload failed');
      expect(fileRepository.create).not.toHaveBeenCalled();
    });

    it('should handle database creation errors', async () => {
      const fileKey = mockUuid;
      storageService.uploadFile.mockResolvedValue(fileKey);
      fileRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.uploadFile(mockFile, userId)).rejects.toThrow('Database error');
    });
  });

  describe('downloadFile', () => {
    const fileKey = '550e8400-e29b-41d4-a716-446655440000';

    it('should successfully download a file and return stream data', async () => {
      storageService.getFileStream.mockResolvedValue(mockFileStreamData);

      const result = await service.downloadFile(fileKey);

      expect(storageService.getFileStream).toHaveBeenCalledWith(fileKey);
      expect(result).toEqual(mockFileStreamData);
    });

    it('should handle storage service download errors', async () => {
      storageService.getFileStream.mockRejectedValue(new Error('File not found'));

      await expect(service.downloadFile(fileKey)).rejects.toThrow('File not found');
    });
  });

  describe('getPresignedUrl', () => {
    const fileKey = '550e8400-e29b-41d4-a716-446655440000';
    const mockPresignedUrl = 'https://s3.amazonaws.com/bucket/file-key?X-Amz-Algorithm=AWS4-HMAC-SHA256&...';

    it('should successfully generate presigned URL', async () => {
      storageService.getPresignedUrl.mockResolvedValue(mockPresignedUrl);
      fileRepository.findByKey.mockResolvedValue(mockFileEntity);

      const result = await service.getPresignedUrl(fileKey);

      expect(storageService.getPresignedUrl).toHaveBeenCalledWith(fileKey);
      expect(fileRepository.findByKey).toHaveBeenCalledWith(fileKey);
      expect(result).toEqual({ url: mockPresignedUrl, key: fileKey, filename: mockFileEntity.filename });
    });

    it('should return URL without filename when file record not found', async () => {
      storageService.getPresignedUrl.mockResolvedValue(mockPresignedUrl);
      fileRepository.findByKey.mockResolvedValue(null);

      const result = await service.getPresignedUrl(fileKey);

      expect(storageService.getPresignedUrl).toHaveBeenCalledWith(fileKey);
      expect(fileRepository.findByKey).toHaveBeenCalledWith(fileKey);
      expect(result).toEqual({ url: mockPresignedUrl, key: fileKey });
    });

    it('should handle storage service presigned URL errors', async () => {
      storageService.getPresignedUrl.mockRejectedValue(new Error('Failed to generate presigned URL'));

      await expect(service.getPresignedUrl(fileKey)).rejects.toThrow('Failed to generate presigned URL');
    });
  });

  describe('generatePresignedUrlForUpload', () => {
    const userId = 1;
    const filename = 'test-document.pdf';
    const mimetype = 'application/pdf';
    const size = 1024000;
    const mockPresignedUrl = 'https://s3.amazonaws.com/bucket/upload-key?X-Amz-Algorithm=AWS4-HMAC-SHA256&...';

    it('should successfully generate presigned URL for upload', async () => {
      storageService.generatePresignedUrlForUpload.mockResolvedValue(mockPresignedUrl);

      const result = await service.generatePresignedUrlForUpload(filename, mimetype, size, userId);

      expect(uuidv4).toHaveBeenCalled();
      expect(storageService.generatePresignedUrlForUpload).toHaveBeenCalledWith(mockUuid, mimetype, size);
      expect(result).toEqual({ url: mockPresignedUrl, key: mockUuid });
    });

    it('should handle storage service errors', async () => {
      storageService.generatePresignedUrlForUpload.mockRejectedValue(new Error('Failed to generate presigned URL'));

      await expect(service.generatePresignedUrlForUpload(filename, mimetype, size, userId))
        .rejects.toThrow('Failed to generate presigned URL');
    });
  });

  describe('createFileRecord', () => {
    const userId = 1;
    const key = '550e8400-e29b-41d4-a716-446655440000';
    const filename = 'test-document.pdf';
    const size = 1024000;
    const mimetype = 'application/pdf';

    it('should successfully create file record', async () => {
      fileRepository.create.mockResolvedValue(mockFileEntity);

      const result = await service.createFileRecord(key, filename, size, mimetype, userId);

      expect(fileRepository.create).toHaveBeenCalledWith({
        key,
        filename,
        size,
        mimetype,
        uploadedBy: userId,
      });
      expect(result).toEqual(mockFileResponse);
    });

    it('should handle database errors', async () => {
      fileRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createFileRecord(key, filename, size, mimetype, userId))
        .rejects.toThrow('Database error');
    });
  });

  describe('listFiles', () => {
    const userId = 1;
    const mockFileEntities: FileEntity[] = [
      {
        id: 1,
        key: '550e8400-e29b-41d4-a716-446655440000',
        filename: 'document1.pdf',
        size: 1024000,
        mimetype: 'application/pdf',
        uploadedBy: userId,
        uploadedAt: new Date('2024-01-15T10:30:00.000Z'),
        user: undefined,
      },
    ];

    it('should successfully list files for a user', async () => {
      fileRepository.findByUser.mockResolvedValue(mockFileEntities);

      const result = await service.listFiles(userId);

      expect(fileRepository.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockFileEntities);
    });

    it('should return empty array when user has no files', async () => {
      fileRepository.findByUser.mockResolvedValue([]);

      const result = await service.listFiles(userId);

      expect(fileRepository.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });

    it('should handle database errors when listing files', async () => {
      fileRepository.findByUser.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.listFiles(userId)).rejects.toThrow('Database connection failed');
    });
  });
}); 
