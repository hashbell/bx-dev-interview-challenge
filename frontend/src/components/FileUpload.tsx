import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import { fileService, UploadProgress } from '../services/file.service';
import { FileItem } from '../types';
import {
  MAX_FILE_SIZE_BYTES,
  ALLOWED_FILE_EXTENSIONS,
  FILE_SIZE_ERROR_MESSAGE,
  FILE_TYPE_ERROR_MESSAGE,
  ERROR_DISPLAY_DURATION_MS,
  SUCCESS_DISPLAY_DURATION_MS,
} from '../constants';
import {
  uploadContainerStyles,
  folderIconStyles,
  successAlertStyles,
  progressTextStyles,
  progressBarStyles,
  fileNameStyles,
  fileSizeStyles,
  uploadButtonStyles,
  clearButtonStyles,
  chooseFileButtonStyles,
  titleStyles,
  descriptionStyles,
  toggleButtonGroupStyles,
  modeChipStyles,
  modeTitleStyles,
  compactErrorStyles,
  errorTextStyles,
  errorCountdownStyles,
  enhancedValidationChipStyles,
  modeToggleContainerStyles,
  modeChipContainerStyles,
  enhancedValidationContainerStyles,
  progressContainerStyles,
  selectedFileContainerStyles,
  uploadButtonsContainerStyles,
} from '../styles/fileUpload.styles';

interface FileUploadProps {
  onFileUploaded: (file: FileItem) => void;
  isDarkMode: boolean;
}

type UploadMode = 'direct' | 'presigned';

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, isDarkMode }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>('direct');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadSuccess) {
      const timeoutId = setTimeout(() => {
        setUploadSuccess(null);
      }, SUCCESS_DISPLAY_DURATION_MS);
      
      return () => clearTimeout(timeoutId);
    }
  }, [uploadSuccess]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, ERROR_DISPLAY_DURATION_MS);
      
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file for presigned URL mode
      if (uploadMode === 'presigned') {
        const validationError = validateFileForPresignedUpload(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }
      
      setSelectedFile(file);
      setError(null);
      setUploadSuccess(null);
    }
  }, [uploadMode]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file for presigned URL mode
      if (uploadMode === 'presigned') {
        const validationError = validateFileForPresignedUpload(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }
      
      setSelectedFile(file);
      setError(null);
      setUploadSuccess(null);
    }
  }, [uploadMode]);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploadSuccess(null);
    setUploading(true);
    setProgress(null);

    try {
      let uploadedFile: FileItem;
      
      if (uploadMode === 'presigned') {
        uploadedFile = await fileService.uploadFileWithPresignedUrl(file, (progress) => {
          setProgress(progress);
        });
      } else {
        uploadedFile = await fileService.uploadFile(file, (progress) => {
          setProgress(progress);
        });
      }
      
      onFileUploaded(uploadedFile);
      setUploadSuccess(`✅ "${file.name}" uploaded successfully using ${uploadMode === 'presigned' ? 'presigned URL' : 'direct upload'}!`);
      
      // Reset the file input and selected file after successful upload
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const handleUploadClick = useCallback(() => {
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  }, [selectedFile, uploadMode]);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleUploadModeChange = useCallback((event: React.MouseEvent<HTMLElement>, newMode: UploadMode | null) => {
    if (newMode !== null) {
      setUploadMode(newMode);
      setError(null);
      setUploadSuccess(null);
      
      // Re-validate selected file if switching to presigned mode
      if (newMode === 'presigned' && selectedFile) {
        const validationError = validateFileForPresignedUpload(selectedFile);
        if (validationError) {
          setError(validationError);
        }
      }
    }
  }, [selectedFile]);

  const getModeDescription = () => {
    if (uploadMode === 'presigned') {
      return 'Upload directly to cloud storage for better performance and reliability';
    }
    return 'Upload through our server for enhanced security and processing';
  };

  const getModeIcon = () => {
    return uploadMode === 'presigned' ? '☁️' : '🛡️';
  };

  const validateFileForPresignedUpload = (file: File): string | null => {
    // Check file size using constant
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return FILE_SIZE_ERROR_MESSAGE(file.size / (1024 * 1024));
    }

    // Check if file has a valid extension using constant
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
      return FILE_TYPE_ERROR_MESSAGE();
    }

    // Check filename for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(file.name)) {
      return 'Filename contains invalid characters. Cannot contain: < > : " / \\ | ? *';
    }

    // Check filename length
    if (file.name.length > 255) {
      return 'Filename is too long (maximum 255 characters)';
    }

    // Check if filename starts or ends with spaces or dots
    if (file.name.startsWith('.') || file.name.endsWith('.') || 
        file.name.startsWith(' ') || file.name.endsWith(' ')) {
      return 'Filename cannot start or end with spaces or dots';
    }

    return null;
  };

  return (
    <Paper
      sx={uploadContainerStyles(isDarkMode, isDragOver)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Typography 
        variant="h1" 
        sx={folderIconStyles(isDarkMode, isDragOver)}
      >
        📁
      </Typography>

      {uploadSuccess && (
        <Alert 
          severity="success" 
          sx={successAlertStyles}
        >
          {uploadSuccess}
        </Alert>
      )}

      {error && (
        <Box sx={compactErrorStyles}>
          <Typography variant="body2" sx={errorTextStyles}>
            ❌ {error}
          </Typography>
          <Typography variant="caption" sx={errorCountdownStyles}>
            Auto-clearing in 4s...
          </Typography>
        </Box>
      )}

      {/* Upload Mode Toggle */}
      <Box sx={modeToggleContainerStyles}>
        <Typography 
          variant="h6" 
          sx={modeTitleStyles(isDarkMode)}
        >
          Choose Upload Method
        </Typography>
        <ToggleButtonGroup
          value={uploadMode}
          exclusive
          onChange={handleUploadModeChange}
          aria-label="upload mode"
          sx={toggleButtonGroupStyles(isDarkMode)}
        >
          <ToggleButton value="direct" aria-label="direct upload">
            🛡️ Direct Upload
          </ToggleButton>
          <ToggleButton value="presigned" aria-label="presigned upload">
            ☁️ Presigned URL
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Box sx={modeChipContainerStyles}>
          <Chip
            icon={<span>{getModeIcon()}</span>}
            label={getModeDescription()}
            variant="outlined"
            sx={modeChipStyles(isDarkMode)}
          />
        </Box>
        
        {uploadMode === 'presigned' && (
          <Box sx={enhancedValidationContainerStyles}>
            <Chip
              label="Enhanced validation enabled"
              size="small"
              color="info"
              variant="outlined"
              sx={enhancedValidationChipStyles(isDarkMode)}
            />
          </Box>
        )}
      </Box>

      {uploading && progress ? (
        <Box sx={progressContainerStyles}>
          <Typography 
            variant="body2" 
            sx={progressTextStyles(isDarkMode)}
          >
            {uploadMode === 'presigned' ? (
              <>
                {progress.progress < 30 && 'Getting presigned URL...'}
                {progress.progress >= 30 && progress.progress < 90 && 'Uploading to cloud storage...'}
                {progress.progress >= 90 && 'Creating file record...'}
              </>
            ) : (
              'Uploading file...'
            )} {progress.progress}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress.progress}
            sx={progressBarStyles(isDarkMode)}
          />
        </Box>
      ) : selectedFile ? (
        <Box sx={selectedFileContainerStyles}>
          <Typography 
            variant="h6" 
            sx={fileNameStyles(isDarkMode)}
          >
            📄 {selectedFile.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={fileSizeStyles(isDarkMode)}
          >
            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
          <Box sx={uploadButtonsContainerStyles}>
            <Button
              variant="contained"
              onClick={handleUploadClick}
              disabled={uploading}
              sx={uploadButtonStyles}
            >
              🚀 Upload with {uploadMode === 'presigned' ? 'Presigned URL' : 'Direct Upload'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFile}
              disabled={uploading}
              sx={clearButtonStyles(isDarkMode)}
            >
              ❌ Clear
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Typography 
            variant="h4" 
            sx={titleStyles(isDarkMode)}
          >
            Upload Files
          </Typography>
          <Typography 
            variant="body1" 
            sx={descriptionStyles(isDarkMode)}
          >
            Drag and drop files here or click to browse
          </Typography>
          
          <input
            accept="*/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
            ref={fileInputRef}
          />
          <label htmlFor="file-upload">
            <Button
              component="span"
              variant="contained"
              disabled={uploading}
              sx={chooseFileButtonStyles(isDarkMode)}
            >
              Choose File
            </Button>
          </label>
        </>
      )}
    </Paper>
  );
}; 
