export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const MIME_TYPE_NAMES: Record<string, string> = {
  // Images
  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'image/gif': 'GIF Image',
  'image/webp': 'WebP Image',
  'image/svg+xml': 'SVG Vector Image',
  'image/bmp': 'BMP Image',
  'image/tiff': 'TIFF Image',
  
  // Documents
  'application/pdf': 'PDF Document',
  'text/plain': 'Text File',
  'text/csv': 'CSV Spreadsheet',
  'text/html': 'HTML File',
  'text/css': 'CSS Stylesheet',
  'text/javascript': 'JavaScript File',
  'application/json': 'JSON Data File',
  'application/xml': 'XML Document',
  
  // Microsoft Office
  'application/msword': 'Word Document (DOC)',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document (DOCX)',
  'application/vnd.ms-excel': 'Excel Spreadsheet (XLS)',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet (XLSX)',
  'application/vnd.ms-powerpoint': 'PowerPoint Presentation (PPT)',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation (PPTX)',
  
  // OpenDocument
  'application/vnd.oasis.opendocument.text': 'OpenDocument Text',
  'application/vnd.oasis.opendocument.spreadsheet': 'OpenDocument Spreadsheet',
  'application/vnd.oasis.opendocument.presentation': 'OpenDocument Presentation',
  
  // Archives
  'application/zip': 'ZIP Archive',
  'application/x-rar-compressed': 'RAR Archive',
  'application/x-7z-compressed': '7-Zip Archive',
  'application/gzip': 'GZIP Archive',
  'application/x-tar': 'TAR Archive',
  
  // Audio
  'audio/mpeg': 'MP3 Audio',
  'audio/wav': 'WAV Audio',
  'audio/ogg': 'OGG Audio',
  'audio/mp4': 'M4A Audio',
  'audio/aac': 'AAC Audio',
  
  // Video
  'video/mp4': 'MP4 Video',
  'video/webm': 'WebM Video',
  'video/ogg': 'OGG Video',
  'video/avi': 'AVI Video',
  'video/mpeg': 'MPEG Video',
  'video/quicktime': 'QuickTime Video',
  
  // Code/Development
  'application/x-python-code': 'Python Script',
  'application/x-java-archive': 'Java Archive (JAR)',
  'application/x-msdownload': 'Windows Executable',
  'application/x-executable': 'Executable File',
  'application/x-shockwave-flash': 'Flash File',
  
  // CAD/3D
  'application/dxf': 'DXF CAD File',
  'application/x-dwg': 'DWG CAD File',
  'model/stl': 'STL 3D Model',
  'model/obj': 'OBJ 3D Model',
  'model/3mf': '3MF 3D Model',
} as const; 

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const JWT_EXPIRES_IN = '1h';
export const JWT_SECRET = process.env.JWT_SECRET;

export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
export const S3_ENDPOINT = process.env.S3_ENDPOINT;
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
export const S3_REGION = process.env.S3_REGION; 
