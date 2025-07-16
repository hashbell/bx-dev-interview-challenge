import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FilesController } from './files.controller';
import { IFilesService, FILES_SERVICE } from './files.service.interface';
import { FileResponseDto } from './dto/file.dto';
import { FileStreamData } from '@files/types/file-stream.types';
import request from 'supertest';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('FilesController (Endpoints)', () => {
  let app: INestApplication;
  let fileService: jest.Mocked<IFilesService>;

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

  const mockFileResponse: FileResponseDto = {
    id: 1,
    key: '550e8400-e29b-41d4-a716-446655440000',
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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FILES_SERVICE,
          useValue: {
            uploadFile: jest.fn(),
            downloadFile: jest.fn(),
            getPresignedUrl: jest.fn(),
            generatePresignedUrlForUpload: jest.fn(),
            createFileRecord: jest.fn(),
            listFiles: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: 1, email: 'test@example.com' };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    await app.init();

    fileService = module.get(FILES_SERVICE);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /file/upload', () => {
    it('should return 201 and file response when upload is successful', async () => {
      fileService.uploadFile.mockResolvedValue(mockFileResponse);

      const response = await request(app.getHttpServer())
        .post('/file/upload')
        .attach('file', Buffer.from('test content'), 'test-document.pdf')
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        key: '550e8400-e29b-41d4-a716-446655440000',
        filename: 'test-document.pdf',
        size: 1024000,
        mimetype: 'application/pdf',
      });
      expect(fileService.uploadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          originalname: 'test-document.pdf',
          mimetype: 'application/pdf',
        }),
        1
      );
    });

    it('should return 400 when no file is provided', async () => {
      await request(app.getHttpServer())
        .post('/file/upload')
        .expect(400);
    });
  });

  describe('GET /file/download/:key', () => {
    const key = '550e8400-e29b-41d4-a716-446655440000';

    it('should return 404 when file not found', async () => {
      fileService.downloadFile.mockRejectedValue(new Error('File not found'));

      const response = await request(app.getHttpServer())
        .get(`/file/download/${key}`)
        .expect(404);

      expect(response.body).toEqual({ message: 'File not found' });
    });
  });

  describe('GET /file/presigned/:key', () => {
    const key = '550e8400-e29b-41d4-a716-446655440000';
    const mockUrl = 'https://s3.amazonaws.com/bucket/file-key?X-Amz-Algorithm=AWS4-HMAC-SHA256&...';

    it('should return 200 with presigned URL when successful', async () => {
      fileService.getPresignedUrl.mockResolvedValue({ url: mockUrl, key, filename: 'test-document.pdf' });

      const response = await request(app.getHttpServer())
        .get(`/file/presigned/${key}`)
        .expect(200);

      expect(response.body).toEqual({ 
        url: mockUrl, 
        key, 
        filename: 'test-document.pdf' 
      });
      expect(fileService.getPresignedUrl).toHaveBeenCalledWith(key);
    });
  });

  describe('GET /file/presigned-upload', () => {
    const mockPresignedUploadResponse = {
      url: 'https://s3.amazonaws.com/bucket/upload-key?X-Amz-Algorithm=AWS4-HMAC-SHA256&...',
      key: '660e8400-e29b-41d4-a716-446655440000',
    };

    it('should return 200 with presigned upload URL when successful', async () => {
      fileService.generatePresignedUrlForUpload.mockResolvedValue(mockPresignedUploadResponse);

      const response = await request(app.getHttpServer())
        .get('/file/presigned-upload')
        .query({
          filename: 'test-document.pdf',
          mimetype: 'application/pdf',
          size: 1024000,
        })
        .expect(200);

      expect(response.body).toEqual(mockPresignedUploadResponse);
      expect(fileService.generatePresignedUrlForUpload).toHaveBeenCalledWith(
        'test-document.pdf',
        'application/pdf',
        1024000, // Should be converted to number by @Transform
        1
      );
    });

    it('should handle string size parameter correctly', async () => {
      fileService.generatePresignedUrlForUpload.mockResolvedValue(mockPresignedUploadResponse);

      const response = await request(app.getHttpServer())
        .get('/file/presigned-upload')
        .query({
          filename: 'test-document.pdf',
          mimetype: 'application/pdf',
          size: '1024000', // String size
        })
        .expect(200);

      expect(response.body).toEqual(mockPresignedUploadResponse);
      expect(fileService.generatePresignedUrlForUpload).toHaveBeenCalledWith(
        'test-document.pdf',
        'application/pdf',
        1024000, // Should be converted to number
        1
      );
    });
  });

  describe('POST /file/presigned-upload-complete', () => {
    const mockFileRecord = {
      key: '660e8400-e29b-41d4-a716-446655440000',
      filename: 'test-document.pdf',
      size: 1024000,
      mimetype: 'application/pdf',
    };

    it('should return 201 with file record when successful', async () => {
      fileService.createFileRecord.mockResolvedValue(mockFileResponse);

      const response = await request(app.getHttpServer())
        .post('/file/presigned-upload-complete')
        .send(mockFileRecord)
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        key: '550e8400-e29b-41d4-a716-446655440000',
        filename: 'test-document.pdf',
        size: 1024000,
        mimetype: 'application/pdf',
      });
      expect(fileService.createFileRecord).toHaveBeenCalledWith(
        mockFileRecord.key,
        mockFileRecord.filename,
        mockFileRecord.size,
        mockFileRecord.mimetype,
        1
      );
    });
  });

  describe('GET /file/list', () => {
    const mockFiles = [
      {
        id: 1,
        key: '550e8400-e29b-41d4-a716-446655440000',
        filename: 'file1.pdf',
        size: 1024000,
        mimetype: 'application/pdf',
        uploadedAt: new Date('2024-01-15T10:30:00.000Z'),
        uploadedBy: 1,
      },
      {
        id: 2,
        key: '660e8400-e29b-41d4-a716-446655440000',
        filename: 'file2.jpg',
        size: 2048000,
        mimetype: 'image/jpeg',
        uploadedAt: new Date('2024-01-16T10:30:00.000Z'),
        uploadedBy: 1,
      },
    ];

    it('should return 200 with list of user files when successful', async () => {
      fileService.listFiles.mockResolvedValue(mockFiles);

      const response = await request(app.getHttpServer())
        .get('/file/list')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(fileService.listFiles).toHaveBeenCalledWith(1);
    });
  });
}); 
