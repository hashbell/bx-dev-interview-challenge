import { SxProps, Theme } from '@mui/material';

// Container styles
export const fileListContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  p: 4,
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  background: isDarkMode 
    ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(30, 30, 60, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(24px)',
  border: `2px solid ${isDarkMode 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    '&:hover': {
      background: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    },
  },
});

// Loading container styles
export const loadingContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  p: 4,
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  background: isDarkMode 
    ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(30, 30, 60, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(24px)',
  border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
});

// Loading spinner styles
export const loadingSpinnerStyles: SxProps<Theme> = {
  mb: 3,
  color: '#667eea',
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  },
};

export const smallLoadingSpinnerStyles: SxProps<Theme> = {
  color: '#667eea',
};

// Loading text styles
export const loadingTextStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: isDarkMode ? '#94a3b8' : '#64748b',
  fontWeight: 500,
});

// Header styles
export const headerContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  mb: 3,
};

export const titleStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #f093fb 0%, #667eea 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
});

// Alert styles
export const errorAlertStyles: SxProps<Theme> = {
  mb: 3,
  borderRadius: '12px',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
};

// Empty state styles
export const emptyStateContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center',
  flex: 1,
  color: isDarkMode ? '#94a3b8' : '#64748b',
});

export const emptyStateTitleStyles: SxProps<Theme> = {
  mb: 1,
};

export const emptyStateTextStyles: SxProps<Theme> = {
  // Inherits color from parent
};

// List styles
export const listStyles: SxProps<Theme> = {
  flex: 1,
  overflow: 'auto',
};

// List item styles
export const listItemStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  borderRadius: 1,
  mb: 1,
  background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
  pr: 8,
});

// File info styles
export const fileInfoContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  pr: 2,
};

export const fileNameStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: 'calc(100% - 60px)',
});

// File details styles
export const fileDetailsContainerStyles: SxProps<Theme> = {
  mt: 1,
  pr: 2,
};

export const fileSizeChipStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mr: 1,
  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
});

export const fileDateStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: isDarkMode ? '#94a3b8' : '#64748b',
});

// Download button styles
export const downloadButtonContainerStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
};

export const downloadButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: '#6366f1',
  '&:hover': {
    backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.1)',
  },
});

// Download mode toggle styles
export const toggleButtonGroupStyles = (isDarkMode: boolean) => ({
  '& .MuiToggleButton-root': {
    border: `2px solid ${isDarkMode ? '#555' : '#ddd'}`,
    color: isDarkMode ? '#ccc' : '#666',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.9rem',
    padding: '8px 16px',
    '&.Mui-selected': {
      backgroundColor: isDarkMode ? '#1976d2' : '#1976d2',
      color: '#fff',
      '&:hover': {
        backgroundColor: isDarkMode ? '#1565c0' : '#1565c0',
      },
    },
    '&:hover': {
      backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
    },
  },
});

export const modeChipStyles = (isDarkMode: boolean) => ({
  borderColor: isDarkMode ? '#555' : '#ddd',
  color: isDarkMode ? '#ccc' : '#666',
  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
  '& .MuiChip-icon': {
    fontSize: '1.2rem',
  },
});

export const modeTitleStyles = (isDarkMode: boolean) => ({
  color: isDarkMode ? '#fff' : '#333',
  fontWeight: 600,
  marginBottom: '16px',
}); 
