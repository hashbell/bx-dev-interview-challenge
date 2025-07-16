import React from 'react';
import { Box, Typography } from '@mui/material';
import { UploadAreaProps } from '../../types';
import { formatFileSize } from '../../utils';
import {
  uploadAreaContainerStyles,
  uploadAreaTitleStyles,
  selectedFileContainerStyles,
  selectedFileNameStyles,
} from '../../styles/fileManagement.styles';

export const UploadArea: React.FC<UploadAreaProps> = ({ 
  onFileSelect, 
  selectedFile, 
  uploading, 
  mode 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <>
      <Box className="upload-area" sx={uploadAreaContainerStyles}>
        <Typography variant="h6" color="text.secondary" sx={uploadAreaTitleStyles}>
          📎 Drag & Drop or Click to Select
        </Typography>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            width: '100%', 
            padding: '20px',
            border: 'none',
            background: 'transparent'
          }}
        />
      </Box>
      {selectedFile && (
        <Box sx={selectedFileContainerStyles}>
          <Typography variant="body1" sx={selectedFileNameStyles(mode)}>
            📄 {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </Typography>
        </Box>
      )}
    </>
  );
}; 
