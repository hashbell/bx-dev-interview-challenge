import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, file, files } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip || request.connection.remoteAddress;
    const now = Date.now();

    this.logger.log(
      `📥 ${method} ${url} - ${ip} - ${userAgent} - User: ${user?.id || 'anonymous'}`
    );

    if (body && Object.keys(body).length > 0 && !file && !files) {
      this.logger.debug(`📄 Request Body: ${JSON.stringify(body)}`);
    }

    if (file) {
      this.logger.log(
        `📁 File Upload: ${file.originalname} (${file.size} bytes, ${file.mimetype})`
      );
    }

    if (files && files.length > 0) {
      this.logger.log(
        `📁 Multiple Files Upload: ${files.length} files, total size: ${files.reduce((sum: number, f: any) => sum + f.size, 0)} bytes`
      );
    }

    return next.handle().pipe(
      tap((response) => {
        const responseTime = Date.now() - now;
        this.logger.log(
          `📤 ${method} ${url} - ${responseTime}ms - Status: 200 ✅`
        );

        if (response && typeof response === 'object') {
          if (response.key && response.filename) {
            this.logger.log(`📁 File stored: ${response.filename} (${response.size} bytes)`);
          }
          if (response.files) {
            this.logger.log(`📁 Listed ${response.files.length} files`);
          }
          if (response.url) {
            this.logger.log(`🔗 Presigned URL generated for: ${response.url.split('/').pop()}`);
          }
        }
        
        this.logger.debug(`📄 Response: ${JSON.stringify(response)}`);
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        this.logger.error(
          `❌ ${method} ${url} - ${responseTime}ms - Status: ${error.status || 500} - ${error.message}`
        );

        if (error.stack) {
          this.logger.error(`🔍 Error Stack: ${error.stack}`);
        }
        
        throw error;
      }),
    );
  }
} 
