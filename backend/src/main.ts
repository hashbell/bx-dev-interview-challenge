import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig, swaggerOptions } from './configs/swagger.config';

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: 'Bonusx',
  });
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Swagger Documentation
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, swaggerOptions);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') as number;

  await app.listen(port, () => {
    logger.log(
      `🚀 Bonusx File Uploader is running on: http://localhost:${port}`,
    );
    logger.log(
      `📚 API Documentation available at: http://localhost:${port}/api/docs`,
    );
  });
}
bootstrap();
