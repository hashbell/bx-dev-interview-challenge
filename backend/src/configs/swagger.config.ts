import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Bonusx File Upload API')
  .setDescription(`
    ## Overview
    A secure file upload and management API with JWT authentication and S3-compatible storage.
    
    ## Features
    - 🔐 JWT Authentication
    - 📁 File Upload/Download
    - 🔗 Presigned URLs
    - 📋 File Listing
    - 🛡️ File Validation
    - 📊 File Metadata
  `)
  .setVersion('1.0.0')
  .addTag('Authentication', 'User registration and login endpoints')
  .addTag('Files', 'File upload, download, and management endpoints')
  .addTag('Health', 'API health check endpoints')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addServer('http://localhost:3001', 'Development server')
  .addServer('https://api.bonusx.com', 'Production server')
  .build();

export const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
    syntaxHighlight: {
      activated: true,
      theme: 'monokai',
    },
  },
  customSiteTitle: 'Bonusx API Documentation',
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6; font-size: 36px; }
    .swagger-ui .info .description { font-size: 16px; line-height: 1.6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
  `,
}; 
