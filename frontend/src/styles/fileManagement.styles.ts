import { SxProps, Theme } from '@mui/material';

// UploadArea styles
export const uploadAreaContainerStyles: SxProps<Theme> = {
  mb: 4,
  p: 4,
};

export const uploadAreaTitleStyles: SxProps<Theme> = {
  mb: 3,
  textAlign: 'center',
};

export const fileInputStyles: SxProps<Theme> = {
  width: '100%',
  padding: '20px',
  border: 'none',
  background: 'transparent',
};

export const selectedFileContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  mb: 3,
};

export const selectedFileNameStyles = (mode: 'light' | 'dark'): SxProps<Theme> => ({
  color: mode === 'light' ? '#374151' : '#d1d5db',
  fontWeight: 'medium',
});

// FileCard styles
export const fileCardContainerStyles = (mode: 'light' | 'dark'): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  p: 3,
  borderRadius: 3,
  position: 'relative',
  overflow: 'hidden',
  background: mode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(31, 41, 55, 0.8)',
  border: `1px solid ${mode === 'light' 
    ? 'rgba(0, 0, 0, 0.1)' 
    : 'rgba(255, 255, 255, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: mode === 'light'
      ? '0 8px 25px rgba(0, 0, 0, 0.1)'
      : '0 8px 25px rgba(0, 0, 0, 0.3)',
  },
});

export const fileInfoContainerStyles: SxProps<Theme> = {
  flexGrow: 1,
};

export const fileNameStyles = (mode: 'light' | 'dark'): SxProps<Theme> => ({
  fontWeight: 'bold',
  mb: 1,
  color: mode === 'light' ? '#1f2937' : '#f3f4f6',
});

export const fileDetailsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  mb: 2,
};

export const fileTypeChipStyles = (mimetype: string): SxProps<Theme> => ({
  backgroundColor: getFileTypeColor(mimetype),
  color: 'white',
  fontWeight: 'bold',
});

export const fileSizeStyles = (mode: 'light' | 'dark'): SxProps<Theme> => ({
  color: mode === 'light' ? '#6b7280' : '#9ca3af',
});

export const fileDateStyles = (mode: 'light' | 'dark'): SxProps<Theme> => ({
  color: mode === 'light' ? '#6b7280' : '#9ca3af',
});

export const actionButtonsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 1.5,
};

export const downloadButtonStyles: SxProps<Theme> = {
  px: 2,
  py: 1,
  fontSize: '0.875rem',
  fontWeight: 'bold',
};

export const presignedButtonStyles: SxProps<Theme> = {
  px: 2,
  py: 1,
  fontSize: '0.875rem',
  fontWeight: 'bold',
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  borderColor: '#3b82f6',
  color: '#3b82f6',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#2563eb',
    color: '#2563eb',
  },
};

// Helper function for file type colors (this should be imported from utils)
const getFileTypeColor = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return '#10b981';
  if (mimetype.startsWith('video/')) return '#f59e0b';
  if (mimetype.startsWith('audio/')) return '#8b5cf6';
  if (mimetype.includes('pdf')) return '#ef4444';
  if (mimetype.includes('word') || mimetype.includes('document')) return '#3b82f6';
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '#10b981';
  if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return '#f59e0b';
  return '#6b7280';
}; 
