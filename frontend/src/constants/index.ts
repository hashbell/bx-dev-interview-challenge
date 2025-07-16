/**
 * Application constants
 * 
 * CONFIGURATION GUIDE:
 * To change the file size limit, modify the MAX_FILE_SIZE_BYTES constant below.
 * Examples:
 * - 10MB: 10 * 1024 * 1024
 * - 25MB: 25 * 1024 * 1024
 * - 100MB: 100 * 1024 * 1024
 * 
 * Note: Make sure to also update the backend MAX_FILE_SIZE constant to match.
 */

// File upload constants
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB in bytes
export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024); // 5MB for display

// Allowed file types (MIME types)
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
];

// File type extensions for display
export const ALLOWED_FILE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.pdf', '.txt', '.csv',
  '.doc', '.docx', '.xls', '.xlsx',
  '.zip'
];

// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Upload configuration
export const UPLOAD_TIMEOUT_MS = 30000; // 30 seconds
export const MAX_RETRY_ATTEMPTS = 3;

// UI constants
export const ERROR_DISPLAY_DURATION_MS = 4000; // 4 seconds
export const SUCCESS_DISPLAY_DURATION_MS = 3000; // 3 seconds

// Validation messages
export const FILE_SIZE_ERROR_MESSAGE = (fileSizeMB: number) => 
  `File size (${fileSizeMB.toFixed(2)}MB) exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB}MB`;

export const FILE_TYPE_ERROR_MESSAGE = () => 
  `File type not allowed. Allowed types: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`;

export const FILE_REQUIRED_MESSAGE = 'Please select a file to upload'; 
