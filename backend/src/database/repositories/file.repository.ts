import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '@/database/entities/file.entity';
import { CreateFileDto } from '@files/dto/file.dto';
import { IFileRepository } from '@/shared/interfaces/storage.interface';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(fileData: CreateFileDto): Promise<FileEntity> {
    const file = new FileEntity(
      fileData.key,
      fileData.filename,
      fileData.size,
      fileData.mimetype,
      fileData.uploadedBy
    );
    return this.fileRepository.save(file);
  }

  async findAll(): Promise<FileEntity[]> {
    return this.fileRepository.find({ relations: ['user'] });
  }

  async findByUser(userId: number): Promise<FileEntity[]> {
    return this.fileRepository.find({ 
      where: { uploadedBy: userId },
      relations: ['user'],
      order: { uploadedAt: 'DESC' }
    });
  }

  async findByKey(key: string): Promise<FileEntity | null> {
    return this.fileRepository.findOne({ 
      where: { key },
      relations: ['user']
    });
  }
} 
