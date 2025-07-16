import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { fileService } from '../services/file.service';
import { FileItem } from '../types';
import {
  fileListContainerStyles,
  loadingContainerStyles,
  loadingSpinnerStyles,
  smallLoadingSpinnerStyles,
  loadingTextStyles,
  headerContainerStyles,
  titleStyles,
  errorAlertStyles,
  emptyStateContainerStyles,
  emptyStateTitleStyles,
  emptyStateTextStyles,
  listStyles,
  listItemStyles,
  fileInfoContainerStyles,
  fileNameStyles,
  fileDetailsContainerStyles,
  fileSizeChipStyles,
  fileDateStyles,
  downloadButtonContainerStyles,
  downloadButtonStyles,
} from '../styles/fileList.styles';
import {
  toggleButtonGroupStyles,
  modeChipStyles,
  modeTitleStyles,
} from '../styles/fileUpload.styles';

interface FileListProps {
  isDarkMode: boolean;
  refreshTrigger?: number;
}

type DownloadMode = 'direct' | 'presigned';

export const FileList: React.FC<FileListProps> = ({ isDarkMode, refreshTrigger = 0 }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadMode, setDownloadMode] = useState<DownloadMode>('direct');

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

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      loadFiles();
    }
  }, [refreshTrigger, loadFiles]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    if (refreshTrigger > 0 && !loading) {
      setIsRefreshing(true);
      const timer = setTimeout(() => setIsRefreshing(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger, loading]);

  const handleDownload = async (fileId: number) => {
    try {
      setDownloading(fileId);
      
      if (downloadMode === 'presigned') {
        await fileService.downloadFileWithPresignedUrl(fileId);
      } else {
        await fileService.downloadFile(fileId);
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadModeChange = useCallback((event: React.MouseEvent<HTMLElement>, newMode: DownloadMode | null) => {
    if (newMode !== null) {
      setDownloadMode(newMode);
      setError(null);
    }
  }, []);

  const getModeDescription = () => {
    if (downloadMode === 'presigned') {
      return 'Download directly from cloud storage for better performance';
    }
    return 'Download through our server for enhanced security';
  };

  const getModeIcon = () => {
    return downloadMode === 'presigned' ? '☁️' : '🛡️';
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.startsWith('video/')) return '🎥';
    if (mimetype.startsWith('audio/')) return '🎵';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word') || mimetype.includes('document')) return '📝';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return '📈';
    return '📁';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Paper sx={loadingContainerStyles(isDarkMode)}>
        <CircularProgress sx={loadingSpinnerStyles} />
        <Typography variant="body1" sx={loadingTextStyles(isDarkMode)}>
          Loading files...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={fileListContainerStyles(isDarkMode)}>
      <Box sx={headerContainerStyles}>
        <Typography variant="h4" sx={titleStyles(isDarkMode)}>
          📂 Your Files ({files.length})
        </Typography>
        {isRefreshing && (
          <CircularProgress size={20} sx={smallLoadingSpinnerStyles} />
        )}
      </Box>

      {/* Download Mode Toggle */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          sx={modeTitleStyles(isDarkMode)}
        >
          Choose Download Method
        </Typography>
        <ToggleButtonGroup
          value={downloadMode}
          exclusive
          onChange={handleDownloadModeChange}
          aria-label="download mode"
          sx={toggleButtonGroupStyles(isDarkMode)}
        >
          <ToggleButton value="direct" aria-label="direct download">
            🛡️ Direct Download
          </ToggleButton>
          <ToggleButton value="presigned" aria-label="presigned download">
            ☁️ Presigned URL
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Box sx={{ mt: 2 }}>
          <Chip
            icon={<span>{getModeIcon()}</span>}
            label={getModeDescription()}
            variant="outlined"
            sx={modeChipStyles(isDarkMode)}
          />
        </Box>
        
        {downloadMode === 'presigned' && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label="Enhanced performance enabled"
              size="small"
              color="info"
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                backgroundColor: isDarkMode ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
              }}
            />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={errorAlertStyles}>
          {error}
        </Alert>
      )}

      {files.length === 0 ? (
        <Box sx={emptyStateContainerStyles(isDarkMode)}>
          <Typography variant="h6" sx={emptyStateTitleStyles}>
            No files yet
          </Typography>
          <Typography variant="body2" sx={emptyStateTextStyles}>
            Upload your first file to get started
          </Typography>
        </Box>
      ) : (
        <List sx={listStyles}>
          {files.map((file) => (
            <ListItem key={file.id} sx={listItemStyles(isDarkMode)}>
              <Box sx={{ flex: 1 }}>
                <Box sx={fileInfoContainerStyles}>
                  <Typography variant="h6">
                    {getFileIcon(file.mimetype)}
                  </Typography>
                  <Typography variant="body1" sx={fileNameStyles(isDarkMode)}>
                    {file.filename}
                  </Typography>
                </Box>
                <Box sx={fileDetailsContainerStyles}>
                  <Chip 
                    label={fileService.formatFileSize(file.size)}
                    size="small"
                    sx={fileSizeChipStyles(isDarkMode)}
                  />
                  <Typography variant="caption" sx={fileDateStyles(isDarkMode)}>
                    {formatDate(file.uploadedAt)}
                  </Typography>
                </Box>
              </Box>
              <ListItemSecondaryAction>
                <Box sx={downloadButtonContainerStyles}>
                  <IconButton
                    onClick={() => handleDownload(file.id)}
                    disabled={downloading === file.id}
                    sx={downloadButtonStyles(isDarkMode)}
                    title={`Download using ${downloadMode === 'presigned' ? 'presigned URL' : 'direct download'}`}
                  >
                    {downloading === file.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      '⬇️'
                    )}
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}; 
