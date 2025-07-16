import { FileItem } from '../types';

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface BackendFileResponse {
  id: number;
  key: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

export interface FileListResponse {
  files: BackendFileResponse[];
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
}

export class FileService {
  private baseUrl = 'http://localhost:3001/api'; // Backend API URL

  private getAuthHeaders(): { Authorization?: string } {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Get all files
  async getFiles(): Promise<FileItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/file/list`, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FileListResponse = await response.json();
      return data.files.map(file => ({
        id: file.id,
        key: file.key,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: file.uploadedAt,
      }));
    } catch (error) {
      console.error('Error fetching files:', error);
      // For demo purposes, return mock data if backend is not available
      throw error;
    }
  }

  // Upload a file
  async uploadFile(file: File, onProgress?: (progress: UploadProgress) => void): Promise<FileItem> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use fetch API instead of XMLHttpRequest for better error handling
      const response = await fetch(`${this.baseUrl}/file/upload`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        // Parse error response from backend
        let errorMessage = `Upload failed: ${response.status}`;
        try {
          const errorResponse = await response.json();
          if (errorResponse.message) {
            errorMessage = errorResponse.message;
          } else if (errorResponse.error) {
            errorMessage = errorResponse.error;
          } else if (typeof errorResponse === 'string') {
            errorMessage = errorResponse;
          }
        } catch {
          // If we can't parse the error response, use the response text directly
          const responseText = await response.text();
          if (responseText) {
            errorMessage = responseText;
          }
        }
        
        if (onProgress) {
          onProgress({
            fileId: file.name,
            progress: 0,
            status: 'error',
            error: errorMessage,
          });
        }
        throw new Error(errorMessage);
      }

      const responseData: BackendFileResponse = await response.json();
      const newFile: FileItem = {
        id: responseData.id,
        key: responseData.key,
        filename: responseData.filename,
        size: responseData.size,
        mimetype: responseData.mimetype,
        uploadedAt: responseData.uploadedAt,
      };
      
      if (onProgress) {
        onProgress({
          fileId: file.name,
          progress: 100,
          status: 'completed',
        });
      }
      
      return newFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Handle network errors
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        const errorMessage = 'Network error - please check your connection';
        if (onProgress) {
          onProgress({
            fileId: file.name,
            progress: 0,
            status: 'error',
            error: errorMessage,
          });
        }
        throw new Error(errorMessage);
      }
      
      // For demo purposes, simulate successful upload if backend is not available
      if (error instanceof Error && error.message.includes('Network error')) {
        const newFile: FileItem = {
          id: Date.now(),
          key: file.name,
          filename: file.name,
          size: file.size,
          mimetype: file.type,
          uploadedAt: new Date().toISOString(),
        };
        
        if (onProgress) {
          onProgress({
            fileId: file.name,
            progress: 100,
            status: 'completed',
          });
        }
        
        return newFile;
      }
      throw error;
    }
  }

  // Upload a file using presigned URL
  async uploadFileWithPresignedUrl(file: File, onProgress?: (progress: UploadProgress) => void): Promise<FileItem> {
    try {
      if (onProgress) {
        onProgress({
          fileId: file.name,
          progress: 10,
          status: 'uploading',
        });
      }

      const presignedUrlResponse = await fetch(
        `${this.baseUrl}/file/presigned-upload?filename=${encodeURIComponent(file.name)}&mimetype=${encodeURIComponent(file.type)}&size=${file.size}`,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!presignedUrlResponse.ok) {
        const errorData = await presignedUrlResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to get presigned URL: ${presignedUrlResponse.status}`);
      }

      const presignedData: PresignedUrlResponse = await presignedUrlResponse.json();

      if (onProgress) {
        onProgress({
          fileId: file.name,
          progress: 30,
          status: 'uploading',
        });
      }

      // Upload directly to S3 using presigned URL
      const uploadResponse = await fetch(presignedData.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload to S3: ${uploadResponse.status}`);
      }

      if (onProgress) {
        onProgress({
          fileId: file.name,
          progress: 90,
          status: 'uploading',
        });
      }

      //Create file record in backend
      const createRecordResponse = await fetch(`${this.baseUrl}/file/presigned-upload-complete`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: presignedData.key,
          filename: file.name,
          size: file.size,
          mimetype: file.type,
        }),
      });

      if (!createRecordResponse.ok) {
        // Parse error response from backend
        let errorMessage = `Failed to create file record: ${createRecordResponse.status}`;
        try {
          const errorResponse = await createRecordResponse.json();
          if (errorResponse.message) {
            errorMessage = errorResponse.message;
          } else if (errorResponse.error) {
            errorMessage = errorResponse.error;
          } else if (typeof errorResponse === 'string') {
            errorMessage = errorResponse;
          }
        } catch {
          // If we can't parse the error response, use the response text directly
          const responseText = await createRecordResponse.text();
          if (responseText) {
            errorMessage = responseText;
          }
        }
        throw new Error(errorMessage);
      }

      const response: BackendFileResponse = await createRecordResponse.json();
      const newFile: FileItem = {
        id: response.id,
        key: response.key,
        filename: response.filename,
        size: response.size,
        mimetype: response.mimetype,
        uploadedAt: response.uploadedAt,
      };

      if (onProgress) {
        onProgress({
          fileId: file.name,
          progress: 100,
          status: 'completed',
        });
      }

      return newFile;
    } catch (error) {
      console.error('Error uploading file with presigned URL:', error);
      
      if (onProgress) {
        onProgress({
          fileId: file.name,
          progress: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        });
      }
      
      throw error;
    }
  }

  async downloadFileWithPresignedUrl(fileId: number): Promise<void> {
    try {
      const files = await this.getFiles();
      const file = files.find(f => f.id === fileId);
      
      if (!file) {
        throw new Error('File not found');
      }

      const presignedUrl = await this.getPresignedUrl(fileId);
      
      const response = await fetch(presignedUrl);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file with presigned URL:', error);
      // For demo purposes, show a message if backend is not available
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        alert('Download functionality requires the backend to be running');
      } else {
        throw error;
      }
    }
  }

  // Download a file
  async downloadFile(fileId: number): Promise<void> {
    try {
      const files = await this.getFiles();
      const file = files.find(f => f.id === fileId);
      
      if (!file) {
        throw new Error('File not found');
      }

      const response = await fetch(`${this.baseUrl}/file/download/${file.key}`, {
        headers: {
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      // For demo purposes, show a message if backend is not available
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        alert('Download functionality requires the backend to be running');
      } else {
        throw error;
      }
    }
  }

  // Get presigned URL for file
  async getPresignedUrl(fileId: number): Promise<string> {
    try {
      const files = await this.getFiles();
      const file = files.find(f => f.id === fileId);
      
      if (!file) {
        throw new Error('File not found');
      }

      const response = await fetch(`${this.baseUrl}/file/presigned/${file.key}`, {
        headers: {
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get presigned URL: ${response.status}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      throw error;
    }
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

}

export const fileService = new FileService(); 
