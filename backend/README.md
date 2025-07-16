# Backend Solution - File Management System

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### 1. Install Dependencies
```bash
yarn install
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
```

### 3. Configure S3 Ninja
1. **Start S3 Ninjia**: using docker compose up
2. **Access S3 Ninja Console**: http://localhost:9000/ui
3. **Get Access Keys**: 
   - Copy the Access Key ID and Secret Access Key
4. **Create Bucket**:
   - Click "Create Bucket"
   - Name it `bonusx-bucket` (or your preferred name)
5. **Update .env file** with the values from S3 Ninja

### 4. Start Services
```bash
# Start PostgreSQL and S3 Ninja
docker-compose up -d

# Create S3 bucket (if not done via UI)
yarn create-bucket

# Seed database with test data
yarn seed
```

### 5. Start Application
```bash

yarn start:dev
```

### 6. Access API
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **S3 Ninja Console**: http://localhost:9000

## Key Features

### File Operations
- ✅ **Direct Upload**: `POST /file/upload`
- ✅ **Presigned Upload**: `GET /file/presigned-upload`
- ✅ **File Download**: `GET /file/download/:key`
- ✅ **Presigned Download**: `GET /file/presigned/:key`
- ✅ **File Listing**: `GET /file/list`

### Security
- ✅ JWT Authentication
- ✅ MIME Type Validation (50+ file types)
- ✅ File Size Limits (100MB)
- ✅ UUID-based File Keys
- ✅ User-specific File Access

### Architecture
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL + TypeORM
- **Storage**: AWS S3 (S3 Ninja for dev)
- **Testing**: Jest (90%+ coverage)
- **SOLID**: Fully compliant

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/file/upload` | Upload file directly |
| GET | `/file/download/:key` | Download file |
| GET | `/file/presigned/:key` | Get download URL |
| GET | `/file/presigned-upload` | Get upload URL |
| POST | `/file/presigned-upload-complete` | Complete upload |
| GET | `/file/list` | List user files |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=bonusx_db

# S3 Configuration (get from S3 Ninja UI)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY_ID=your_access_key_from_s3_ninja
S3_SECRET_ACCESS_KEY=your_secret_key_from_s3_ninja
S3_BUCKET_NAME=bonusx-bucket
S3_REGION=us-east-1

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## Testing

```bash
# Unit tests
yarn test

# Coverage
yarn test:cov
```

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Change `PORT` in `.env`
2. **Database connection failed**: Check if PostgreSQL is running
3. **S3 errors**: Verify S3 Ninja is running on port 9000
4. **JWT errors**: Ensure `JWT_SECRET` is set
5. **S3 authentication failed**: Check Access Key ID and Secret from S3 Ninja UI
6. **Bucket not found**: Create bucket in S3 Ninja UI or run `yarn create-bucket`

### Logs
```bash
# Application logs
yarn start:dev

# Docker logs
docker-compose logs -f
```

## Future Enhancements & Time Constraints

Due to time limitations, several production-ready features and improvements were not implemented. Here's what could be added in a real-world scenario:

### 🔐 Security Enhancements
- **Rate Limiting**: Implement API rate limiting using `@nestjs/throttler`
- **File Encryption**: Client-side encryption before upload
- **Audit Logging**: Comprehensive audit trail for all file operations
- **CORS Configuration**: Proper CORS setup for frontend integration
- **API Key Management**: Alternative to JWT for service-to-service communication

### 📁 Advanced File Operations
- **File Versioning**: Support for multiple versions of the same file
- **File Sharing**: Generate shareable links with expiration dates
- **Bulk Operations**: Upload/download multiple files at once
- **File Compression**: Automatic compression for large files
- **Thumbnail Generation**: Auto-generate thumbnails for images
- **File Preview**: In-browser preview for supported file types
- **File Search**: Full-text search across file names and metadata

### 🗄️ Database & Storage
- **Database Migrations**: Proper migration system with rollback support
- **Soft Deletes**: Implement soft delete for file records
- **Storage Tiers**: Hot/cold storage optimization
- **CDN Integration**: CloudFront or similar for global file distribution
- **Backup Strategy**: Automated backup and recovery procedures
- **Database Indexing**: Optimize queries with proper indexing

### 🔄 Performance & Scalability
- **Caching**: Redis integration for frequently accessed data
- **Queue System**: Background job processing (MQTT/RabbitMQ)
- **Database Connection Pooling**: Optimize database connections
- **File Streaming**: Efficient streaming for large files

### 🧪 Testing & Quality
- **E2E Testing**: Complete end-to-end test suite
