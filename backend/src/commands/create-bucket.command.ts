import { Injectable, Logger } from '@nestjs/common';
import { S3Client, CreateBucketCommand as S3CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateBucketCommand {
  private readonly logger = new Logger(CreateBucketCommand.name);

  constructor(private readonly configService: ConfigService) {}

  async execute(): Promise<void> {
    const config = this.getS3Config();
    const s3 = this.createS3Client(config);

    try {
      await this.ensureBucketExists(s3, config.bucketName!);
    } catch (error) {
      this.logger.error('Failed to create bucket', error);
      throw error;
    }
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

  private createS3Client(config: any): S3Client {
    return new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId!,
        secretAccessKey: config.secretAccessKey!,
      },
    });
  }

  async ensureBucketExists(s3: S3Client, bucketName: string): Promise<void> {
    try {
      await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
      this.logger.log(`✅ Bucket '${bucketName}' already exists`);
    } catch (error: any) {
      // If bucket doesn't exist (404) or other error, create it
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        try {
          this.logger.log(`📦 Bucket '${bucketName}' does not exist. Creating...`);
          await s3.send(new S3CreateBucketCommand({ Bucket: bucketName }));
          this.logger.log(`✅ Bucket '${bucketName}' created successfully`);
        } catch (createError: any) {
          if (createError.name === 'BucketAlreadyOwnedByYou' || createError.name === 'BucketAlreadyExists') {
            this.logger.log(`ℹ️  Bucket '${bucketName}' already exists.`);
          } else {
            this.logger.error(`❌ Failed to create bucket '${bucketName}'`, createError);
            throw new Error(`Failed to create bucket '${bucketName}': ${createError.message}`);
          }
        }
      } else {
        this.logger.error(`❌ Error checking bucket '${bucketName}'`, error);
        throw new Error(`Error checking bucket '${bucketName}': ${error.message}`);
      }
    }
  }
} 
