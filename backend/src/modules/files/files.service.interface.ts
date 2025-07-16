import { FileEntity } from '@/database/entities/file.entity';
import { FileStreamData } from '@files/types/file-stream.types';
import { FileResponseDto, PresignedUrlResponseDto } from '@files/dto/file.dto';

export interface IFilesService {
  uploadFile(file: Express.Multer.File, userId: number): Promise<FileResponseDto>;
  downloadFile(key: string): Promise<FileStreamData>;
  getPresignedUrl(key: string): Promise<PresignedUrlResponseDto>;
  generatePresignedUrlForUpload(filename: string, mimetype: string, size: number, userId: number): Promise<PresignedUrlResponseDto>;
  createFileRecord(key: string, filename: string, size: number, mimetype: string, userId: number): Promise<FileResponseDto>;
  listFiles(userId: number): Promise<FileEntity[]>;
}

// Injection token for IFilesService
export const FILES_SERVICE = 'FILES_SERVICE'; 
