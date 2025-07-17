import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileRepository } from './file.repository';
import { FileEntity } from '@/database/entities/file.entity';
import { CreateFileDto } from '@files/dto/file.dto';
import { IFileRepository } from '@/shared/interfaces/storage.interface';

describe('FileRepository', () => {
  let repository: IFileRepository;
  let fileRepository: jest.Mocked<Repository<FileEntity>>;

  const mockFile: FileEntity = {
    id: 1,
    key: '550e8400-e29b-41d4-a716-446655440000',
    filename: 'test-document.pdf',
    size: 1024000,
    mimetype: 'application/pdf',
    uploadedBy: 1,
    uploadedAt: new Date('2024-01-15T10:30:00.000Z'),
    user: undefined,
  };

  const mockCreateFileDto: CreateFileDto = {
    key: '550e8400-e29b-41d4-a716-446655440000',
    filename: 'test-document.pdf',
    size: 1024000,
    mimetype: 'application/pdf',
    uploadedBy: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'FILE_REPOSITORY',
          useClass: FileRepository,
        },
        {
          provide: getRepositoryToken(FileEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<IFileRepository>('FILE_REPOSITORY');
    fileRepository = module.get(getRepositoryToken(FileEntity));
  });

  describe('create', () => {
    it('should create and return a file entity', async () => {
      fileRepository.save.mockResolvedValue(mockFile);

      const result = await repository.create(mockCreateFileDto);

      expect(fileRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          key: mockCreateFileDto.key,
          filename: mockCreateFileDto.filename,
          size: mockCreateFileDto.size,
          mimetype: mockCreateFileDto.mimetype,
          uploadedBy: mockCreateFileDto.uploadedBy,
        })
      );
      expect(result).toEqual(mockFile);
    });
  });

  describe('findAll', () => {
    it('should return all files with user relations', async () => {
      const mockFiles = [mockFile];
      fileRepository.find.mockResolvedValue(mockFiles);

      const result = await repository.findAll();

      expect(fileRepository.find).toHaveBeenCalledWith({ relations: ['user'] });
      expect(result).toEqual(mockFiles);
    });
  });

  describe('findByUser', () => {
    const userId = 1;

    it('should return files for specific user', async () => {
      const mockFiles = [mockFile];
      fileRepository.find.mockResolvedValue(mockFiles);

      const result = await repository.findByUser(userId);

      expect(fileRepository.find).toHaveBeenCalledWith({
        where: { uploadedBy: userId },
        relations: ['user'],
        order: { uploadedAt: 'DESC' },
      });
      expect(result).toEqual(mockFiles);
    });
  });

  describe('findByKey', () => {
    const key = '550e8400-e29b-41d4-a716-446655440000';

    it('should return file when found', async () => {
      fileRepository.findOne.mockResolvedValue(mockFile);

      const result = await repository.findByKey(key);

      expect(fileRepository.findOne).toHaveBeenCalledWith({
        where: { key },
        relations: ['user'],
      });
      expect(result).toEqual(mockFile);
    });

    it('should return null when file not found', async () => {
      fileRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByKey(key);

      expect(result).toBeNull();
    });
  });
}); 
