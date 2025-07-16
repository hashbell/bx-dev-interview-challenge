import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { IStorageService } from '@/shared/interfaces/storage.interface';
import { FileStreamData } from '@files/types/file-stream.types';
import { CreateBucketCommand } from '@/commands/create-bucket.command';

@Injectable()
export class S3StorageService implements IStorageService {
  private s3: S3Client;
  private bucket: string;
  private readonly logger = new Logger(S3StorageService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly createBucketCommand: CreateBucketCommand,
  ) {
    this.initializeS3Client();
    this.ensureBucketExists();
  }

  private initializeS3Client(): void {
    const config = this.getS3Config();

    this.s3 = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId!,
        secretAccessKey: config.secretAccessKey!,
      },
    });
    this.bucket = config.bucketName!;
  }

  private getS3Config() {
    return {
      endpoint: this.configService.get<string>('S3_ENDPOINT'),
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
      bucketName: this.configService.get<string>('S3_BUCKET_NAME'),
      region: this.configService.get<string>('S3_REGION') || 'us-east-1',
    };
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.createBucketCommand.execute();
    } catch (error: any) {
      this.logger.error(`Error ensuring bucket exists:`, error);
      throw new InternalServerErrorException(`Failed to ensure bucket exists: ${error.message}`);
    }
  }

  async uploadFile(file: Express.Multer.File, key: string, mimetype: string): Promise<string> {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: mimetype,
          ACL: 'private',
          Metadata: {
            originalName: file.originalname,
          },
        })
      );
      return key;
    } catch (err) {
      this.logger.error('Failed to upload file to S3', err);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  async listFiles(): Promise<Array<{key: string, size: number, lastModified: Date}>> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
      });
      const response = await this.s3.send(command);
      
      return (response.Contents || []).map(item => ({
        key: item.Key!,
        size: item.Size || 0,
        lastModified: item.LastModified || new Date(),
      }));
    } catch (err) {
      this.logger.error('Failed to list files from S3', err);
      throw new InternalServerErrorException('Failed to list files from S3');
    }
  }

  async getFileStream(key: string): Promise<FileStreamData> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      
      const response = await this.s3.send(command);
      
      return {
        stream: response.Body,
        contentType: response.ContentType || 'application/octet-stream',
        contentLength: response.ContentLength,
      };
    } catch (err) {
      this.logger.error(`Failed to get file stream for key: ${key}`, err);
      throw new InternalServerErrorException('File not found or access denied');
    }
  }

  async getPresignedUrl(key: string, expiresInSeconds = 60): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
    } catch (err) {
      this.logger.error('Failed to generate presigned URL', err);
      throw new InternalServerErrorException('Failed to generate presigned URL');
    }
  }

  async generatePresignedUrlForUpload(key: string, mimetype: string, size: number, expiresInSeconds = 60): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: mimetype,
        ContentLength: size,
        ACL: 'private',
      });
      return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
    } catch (err) {
      this.logger.error('Failed to generate presigned URL for upload', err);
      throw new InternalServerErrorException('Failed to generate presigned URL for upload');
    }
  }
} 
