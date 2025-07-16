import { CommonConfig } from './types/config.types';

function getCommonConfig(): CommonConfig {
  return {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    s3: {
      endpoint: process.env.S3_ENDPOINT,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucketName: process.env.S3_BUCKET_NAME,
    },
    file: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE_IN_MB ?? '5', 10) * 1024 * 1024, // 5MB default
    },
  };
}

export default getCommonConfig;
