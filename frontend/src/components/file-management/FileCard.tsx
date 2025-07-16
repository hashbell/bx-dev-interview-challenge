import React from 'react';
import { Box, Typography, Button, Chip, Tooltip } from '@mui/material';
import { FileCardProps } from '../../types';
import { formatFileSize, formatDate } from '../../utils';
import {
  fileCardContainerStyles,
  fileInfoContainerStyles,
  fileNameStyles,
  fileDetailsContainerStyles,
  fileTypeChipStyles,
  fileSizeStyles,
  fileDateStyles,
  actionButtonsContainerStyles,
  downloadButtonStyles,
  presignedButtonStyles,
} from '../../styles/fileManagement.styles';

export const FileCard: React.FC<FileCardProps> = ({ 
  file, 
  onDownload, 
  loading, 
  mode 
}) => {
  return (
    <Box 
      className={mode === 'light' ? "file-card" : "file-card-dark"}
      sx={fileCardContainerStyles(mode)}
    >
      <Box sx={fileInfoContainerStyles}>
        <Typography variant="h6" sx={fileNameStyles(mode)}>
          📄 {file.filename}
        </Typography>
        <Box sx={fileDetailsContainerStyles}>
          <Chip 
            label={file.mimetype.split('/')[1]?.toUpperCase() || 'FILE'} 
            size="small"
            sx={fileTypeChipStyles(file.mimetype)}
          />
          <Typography variant="body2" sx={fileSizeStyles(mode)}>
            📏 {formatFileSize(file.size)}
          </Typography>
          <Typography variant="body2" sx={fileDateStyles(mode)}>
            📅 {formatDate(file.uploadedAt)}
          </Typography>
        </Box>
      </Box>
      <Box sx={actionButtonsContainerStyles}>
        <Tooltip title="Secure direct download through backend">
          <Button
            variant="outlined"
            size="small"
            onClick={() => onDownload(file.key, 'direct')}
            disabled={loading}
            sx={downloadButtonStyles}
          >
            ⬇️ Direct
          </Button>
        </Tooltip>
        <Tooltip title="Fast presigned URL download (opens in new tab)">
          <Button
            variant="outlined"
            size="small"
            onClick={() => onDownload(file.key, 'presigned')}
            disabled={loading}
            sx={presignedButtonStyles}
          >
            ⚡ Presigned
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}; 
