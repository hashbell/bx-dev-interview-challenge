import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, MIME_TYPE_NAMES } from '../constants';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const allowedTypeNames = ALLOWED_MIME_TYPES.map(type => MIME_TYPE_NAMES[type]).join(', ');
      const attemptedTypeName = MIME_TYPE_NAMES[file.mimetype] || file.mimetype;
      
      throw new BadRequestException(
        `File type "${attemptedTypeName}" is not allowed. Allowed types: ${allowedTypeNames}`,
      );
    }

    return file;
  }
} 
