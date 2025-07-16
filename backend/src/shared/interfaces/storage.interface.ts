import { FileEntity } from '@/database/entities/file.entity';
import { FileStreamData } from '@files/types/file-stream.types';
import { CreateFileDto, FileResponseDto } from '@files/dto/file.dto';

export const FILE_REPOSITORY = 'FILE_REPOSITORY';
export const FILE_SERVICE = 'FILE_SERVICE';

export interface IStorageService {
  uploadFile(file: Express.Multer.File, key: string, mimetype: string): Promise<string>;
  getFileStream(key: string): Promise<FileStreamData>;
  getPresignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  generatePresignedUrlForUpload(key: string, mimetype: string, size: number, expiresInSeconds?: number): Promise<string>;
  listFiles(): Promise<Array<{key: string, size: number, lastModified: Date}>>;
}

export interface IFileRepository {
  create(data: CreateFileDto): Promise<FileEntity>;
  findAll(): Promise<FileEntity[]>;
  findByUser(userId: number): Promise<FileEntity[]>;
  findByKey(key: string): Promise<FileEntity | null>;
}

export interface IFileService {
  uploadFile(file: Express.Multer.File, userId: number): Promise<FileResponseDto>;
  downloadFile(key: string): Promise<FileStreamData>;
  getPresignedUrl(key: string): Promise<string>;
  listFiles(userId: number): Promise<FileEntity[]>;
} 
