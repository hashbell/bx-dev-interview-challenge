import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FILE_SERVICE, FILE_REPOSITORY, IStorageService, IFileRepository } from '@/shared/interfaces/storage.interface';
import { FileEntity } from '@/database/entities/file.entity';
import { FileStreamData } from '@files/types/file-stream.types';
import { FileResponseDto, PresignedUrlResponseDto } from '@files/dto/file.dto';
import { IFilesService } from './files.service.interface';

@Injectable()
export class FilesService implements IFilesService {
  constructor(
    @Inject(FILE_SERVICE) private readonly storageService: IStorageService,
    @Inject(FILE_REPOSITORY) private readonly fileRepository: IFileRepository,
  ) {}

  async uploadFile(file: Express.Multer.File, userId: number): Promise<FileResponseDto> {
    const fileKey = uuidv4();
    const key = await this.storageService.uploadFile(file, fileKey, file.mimetype);
    
    const fileRecord = await this.fileRepository.create({
      key,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: userId,
    });

    return {
      key,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: fileRecord.uploadedAt,
      id: fileRecord.id,
    };
  }

  async downloadFile(key: string): Promise<FileStreamData> {
    return this.storageService.getFileStream(key);
  }

  async getPresignedUrl(key: string): Promise<PresignedUrlResponseDto> {
    const url = await this.storageService.getPresignedUrl(key);
    try {
      const fileRecord = await this.fileRepository.findByKey(key);
      return {
        url,
        key,
        filename: fileRecord?.filename
      };
    } catch (error) {
      // If we can't get filename, just return URL
      return { url, key };
    }
  }

  async generatePresignedUrlForUpload(filename: string, mimetype: string, size: number, userId: number): Promise<{ url: string; key: string }> {
    const fileKey = uuidv4();
    const url = await this.storageService.generatePresignedUrlForUpload(fileKey, mimetype, size);
    
    return {
      url,
      key: fileKey,
    };
  }

  async createFileRecord(key: string, filename: string, size: number, mimetype: string, userId: number): Promise<FileResponseDto> {
    const fileRecord = await this.fileRepository.create({
      key,
      filename,
      size,
      mimetype,
      uploadedBy: userId,
    });

    return {
      key,
      filename,
      size,
      mimetype,
      uploadedAt: fileRecord.uploadedAt,
      id: fileRecord.id,
    };
  }

  async listFiles(userId: number): Promise<FileEntity[]> {
    return this.fileRepository.findByUser(userId);
  }
} 
