export type S3Config = {
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  region?: string;
};

export type CommonConfig = {
  port: number;
  s3: S3Config;
  file: FileConfig;
};

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type FileConfig = {
  maxFileSize: number;
};
