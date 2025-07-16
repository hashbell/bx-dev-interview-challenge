import { useState, useEffect, useCallback } from 'react';
import { fileService } from '../services/file.service';
import { FileItem } from '../types';

export const useFiles = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fileList = await fileService.getFiles();
      setFiles(fileList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setError(null);
      const uploadedFile = await fileService.uploadFile(file);
      setFiles(prev => [uploadedFile, ...prev]);
      return uploadedFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    }
  }, []);

  const downloadFile = useCallback(async (fileId: number) => {
    try {
      setError(null);
      await fileService.downloadFile(fileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return {
    files,
    loading,
    error,
    loadFiles,
    uploadFile,
    downloadFile,
  };
}; 
