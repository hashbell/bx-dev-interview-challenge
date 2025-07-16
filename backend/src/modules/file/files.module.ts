import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '@/database/entities/file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FILES_SERVICE } from './files.service.interface';
import { S3StorageService } from './services/s3-storage.service';
import { FileRepository } from '@/database/repositories/file.repository';
import { FILE_REPOSITORY } from '@/shared/interfaces/storage.interface';
import { FILE_SERVICE } from '@/shared/interfaces/storage.interface';
import { CreateBucketCommand } from '@/commands/create-bucket.command';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [
    {
      provide: FILES_SERVICE,
      useClass: FilesService,
    },
    CreateBucketCommand,
    S3StorageService,
    {
      provide: FILE_REPOSITORY,
      useClass: FileRepository,
    },
    {
      provide: FILE_SERVICE,
      useClass: S3StorageService,
    },
  ],
  controllers: [FilesController],
  exports: [FILES_SERVICE],
})
export class FilesModule {} 
