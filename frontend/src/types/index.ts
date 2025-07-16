// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// File Types
export interface FileItem {
  id: number;
  key: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
  user?: User;
}

export interface FileUploadResponse {
  key: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
  id: number;
}

export interface FileListResponse {
  files: FileItem[];
}

export interface PresignedUrlResponse {
  url: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

// API Response Types
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

// Component Props Types
export interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

export interface FileCardProps {
  file: FileItem;
  onDownload: (key: string, method: 'direct' | 'presigned') => void;
  loading: boolean;
  mode: ThemeMode;
}

export interface UploadAreaProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  uploading: boolean;
  mode: ThemeMode;
}

export interface LoginFormProps {
  onSubmit: (data: LoginRequest) => void;
  error: string | null;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => void;
  error: string | null;
}

// Hook Return Types
export interface UseAuthReturn {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export interface UseFilesReturn {
  files: FileItem[];
  loading: boolean;
  uploading: boolean;
  selectedFile: File | null;
  uploadFile: (file: File) => Promise<void>;
  downloadFile: (key: string, method: 'direct' | 'presigned') => Promise<void>;
  selectFile: (file: File | null) => void;
  loadFiles: () => Promise<void>;
} 
