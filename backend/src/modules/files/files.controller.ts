import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  Request,
  Inject,
  HttpCode,
  Query,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FILES_SERVICE, IFilesService } from './files.service.interface';
import { AuthenticatedRequest } from '../../shared/interfaces/request.interface';
import { FileResponseDto, FileListResponseDto, PresignedUrlResponseDto, FileUploadDto, PresignedUploadCompleteDto } from './dto/file.dto';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { Mapper } from '@/common/utils/mapper/mapper';
import { PresignedUrlQueryDto } from './dto/file.dto';

@ApiTags('Files')
@ApiBearerAuth('JWT-auth')
@Controller('file')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    @Inject(FILES_SERVICE) private readonly fileService: IFilesService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload File',
    description: 'Upload a file to the system. Files are stored with UUID keys for security. Maximum file size: 5MB. Supported formats: Images (JPEG, PNG, GIF, WebP), Documents (PDF, DOC, DOCX, XLS, XLSX), Text files, and more.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    description: 'File upload form data',
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file or validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'File type application/octet-stream is not allowed' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 413,
    description: 'File too large',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 413 },
        message: { type: 'string', example: 'File size exceeds maximum allowed size' },
        error: { type: 'string', example: 'Payload Too Large' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async uploadFile(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File, 
    @Request() req: AuthenticatedRequest
  ): Promise<FileResponseDto> {
    const result = await this.fileService.uploadFile(file, req.user!.id);
    return Mapper.mapToInstance(FileResponseDto, result);
  }

  @Get('download/:key')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Download File',
    description: 'Download a file by its key. Returns the file as a stream.',
  })
  @ApiParam({
    name: 'key',
    description: 'File key (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'File downloaded successfully',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'File not found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async downloadFile(@Param('key') key: string, @Res() res: Response): Promise<void> {
    try {
      const fileData = await this.fileService.downloadFile(key);
      
      res.setHeader('Content-Type', fileData.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
      if (fileData.contentLength) {
        res.setHeader('Content-Length', fileData.contentLength.toString());
      }
      
      fileData.stream.pipe(res);
    } catch (err) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found' });
    }
  }

  @Get('presigned/:key')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Presigned URL for Download',
    description: 'Generate a presigned URL for secure file download. URL expires in 60 seconds.',
  })
  @ApiParam({
    name: 'key',
    description: 'File key (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Presigned URL generated successfully',
    type: PresignedUrlResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async getPresignedUrl(@Param('key') key: string): Promise<PresignedUrlResponseDto> {
    const result = await this.fileService.getPresignedUrl(key);
    return { url: result.url, key, filename: result.filename };
  }

  @Get('presigned-upload')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate Presigned URL for Upload',
    description: 'Generate a presigned URL for secure file upload. URL expires in 5 minutes.',
  })
  @ApiQuery({
    name: 'filename',
    description: 'Original filename',
    example: 'document.pdf',
  })
  @ApiQuery({
    name: 'mimetype',
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @ApiQuery({
    name: 'size',
    description: 'File size in bytes',
    example: 1024000,
  })
  @ApiResponse({
    status: 200,
    description: 'Presigned URL generated successfully',
    type: PresignedUrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid filename, mimetype, or file size',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async generatePresignedUrlForUpload(
    @Query() query: PresignedUrlQueryDto,
    @Request() req: AuthenticatedRequest
  ): Promise<PresignedUrlResponseDto> {
    const result = await this.fileService.generatePresignedUrlForUpload(query.filename, query.mimetype, query.size, req.user!.id);
    return result;
  }

  @Post('presigned-upload-complete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Complete Presigned Upload',
    description: 'Create a file record after successful presigned upload to S3.',
  })
  @ApiBody({
    type: PresignedUploadCompleteDto,
    description: 'File metadata for presigned upload completion',
  })
  @ApiResponse({
    status: 201,
    description: 'File record created successfully',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file data',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async completePresignedUpload(
    @Request() req: AuthenticatedRequest,
    @Body() body: PresignedUploadCompleteDto
  ): Promise<FileResponseDto> {
    const result = await this.fileService.createFileRecord(body.key, body.filename, body.size, body.mimetype, req.user!.id);
    return Mapper.mapToInstance(FileResponseDto, result);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List User Files',
    description: 'Get all files uploaded by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Files retrieved successfully',
    type: FileListResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async listFiles(@Request() req: AuthenticatedRequest): Promise<FileListResponseDto> {
    const files = await this.fileService.listFiles(req.user!.id);
    const transformedFiles = files.map((file: any) => 
      Mapper.mapToInstance(FileResponseDto, file)
    );
    const result = Mapper.mapToInstance(FileListResponseDto, { files: transformedFiles });
    return result;
  }
} 
