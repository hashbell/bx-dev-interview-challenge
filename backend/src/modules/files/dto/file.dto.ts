import { IsString, IsNumber, IsDate, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';
import { Expose, Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsAllowedMimeType } from '@/common/validators/mime-type.validator';
import { MAX_FILE_SIZE } from '@/common/constants';

export class CreateFileDto {
  @ApiProperty({
    description: 'Unique file key (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf',
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: 'User ID who uploaded the file',
    example: 1,
  })
  @IsNumber()
  uploadedBy: number;
}

export class FileResponseDto {
  @ApiProperty({
    description: 'File unique identifier',
    example: 1,
  })
  @Expose()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Unique file key (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf',
  })
  @Expose()
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  @Expose()
  @IsNumber()
  size: number;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @Expose()
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: 'File upload timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @IsDate()
  uploadedAt: Date;

  @Exclude()
  uploadedBy?: number;

  @Exclude()
  user?: any;
}

export class FileListResponseDto {
  @ApiProperty({
    description: 'Array of user files',
    type: [FileResponseDto],
  })
  @Expose()
  files: FileResponseDto[];
}

export class PresignedUrlQueryDto {
  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  filename: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  @IsAllowedMimeType()
  @Transform(({ value }) => value?.trim())
  mimetype: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
    minimum: 1,
    maximum: MAX_FILE_SIZE,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1, { message: 'File size must be greater than 0 bytes' })
  @Max(MAX_FILE_SIZE, { message: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB` })
  size: number;
} 


export class PresignedUrlResponseDto {
  @ApiProperty({
    description: 'Presigned URL for secure file access',
    example: 'https://s3.amazonaws.com/bucket/file-key?X-Amz-Algorithm=AWS4-HMAC-SHA256&...',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'File key (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  filename?: string;
}

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload (max 5MB)',
    example: 'document.pdf',
  })
  file: Express.Multer.File;
}

export class PresignedUploadCompleteDto {
  @ApiProperty({
    description: 'File key (UUID) from presigned upload',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf',
  })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
    minimum: 1,
    maximum: MAX_FILE_SIZE,
  })
  @IsNumber()
  @Min(1)
  @Max(MAX_FILE_SIZE)
  size: number;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  @IsAllowedMimeType()
  mimetype: string;
} 
 