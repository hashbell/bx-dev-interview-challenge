import { SxProps, Theme } from '@mui/material';

// Container styles
export const uploadContainerStyles = (isDarkMode: boolean, isDragOver: boolean): SxProps<Theme> => ({
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
  border: `2px solid ${isDragOver 
    ? '#667eea' 
    : isDarkMode 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '20px',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: isDragOver 
    ? '0 20px 40px rgba(102, 126, 234, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
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
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDragOver 
      ? 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1))'
      : 'transparent',
    opacity: isDragOver ? 1 : 0,
    transition: 'opacity 0.3s ease',
  },
});

// Folder icon styles
export const folderIconStyles = (isDarkMode: boolean, isDragOver: boolean): SxProps<Theme> => ({
  mb: 3, 
  color: '#667eea',
  fontSize: '4rem',
  filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))',
  animation: isDragOver ? 'pulse 1s ease-in-out infinite' : 'none',
});

// Alert styles
export const errorAlertStyles: SxProps<Theme> = {
  mb: 3, 
  width: '100%',
  borderRadius: '12px',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
};

export const successAlertStyles: SxProps<Theme> = {
  mb: 3, 
  width: '100%',
  borderRadius: '12px',
  background: 'rgba(20, 184, 166, 0.1)',
  border: '1px solid rgba(20, 184, 166, 0.3)',
};

// Progress styles
export const progressTextStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mb: 2, 
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  fontWeight: 500,
});

export const progressBarStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    borderRadius: 5,
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
  },
});

// File info styles
export const fileNameStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mb: 2, 
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  fontWeight: 600,
});

export const fileSizeStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mb: 3, 
  color: isDarkMode ? '#94a3b8' : '#64748b',
});

// Button styles
export const uploadButtonStyles: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '12px',
  px: 3,
  py: 1.5,
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'none',
    boxShadow: 'none',
  },
};

export const clearButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  borderRadius: '12px',
  px: 3,
  py: 1.5,
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  '&:disabled': {
    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
  },
});

export const chooseFileButtonStyles = (isDarkMode: boolean) => ({
  backgroundColor: isDarkMode ? '#1976d2' : '#1976d2',
  color: '#fff',
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: isDarkMode ? '0 4px 12px rgba(25, 118, 210, 0.3)' : '0 4px 12px rgba(25, 118, 210, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: isDarkMode ? '#1565c0' : '#1565c0',
    transform: 'translateY(-2px)',
    boxShadow: isDarkMode ? '0 6px 16px rgba(25, 118, 210, 0.4)' : '0 6px 16px rgba(25, 118, 210, 0.3)',
  },
  '&:disabled': {
    backgroundColor: isDarkMode ? '#555' : '#ccc',
    color: isDarkMode ? '#888' : '#666',
    transform: 'none',
    boxShadow: 'none',
  },
});

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

// Typography styles
export const titleStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mb: 3, 
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

export const descriptionStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mb: 4, 
  color: isDarkMode ? '#94a3b8' : '#64748b',
  lineHeight: 1.6,
  maxWidth: '280px',
});

// Animation styles
export const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

export const compactErrorStyles = {
  mb: 2,
  p: 1.5,
  borderRadius: 1,
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  animation: 'fadeIn 0.3s ease-in'
};

export const errorTextStyles = {
  color: '#ef4444',
  fontWeight: 500,
  fontSize: '0.875rem'
};

export const errorCountdownStyles = {
  color: 'rgba(239, 68, 68, 0.7)',
  fontSize: '0.75rem',
  ml: 'auto'
};

export const enhancedValidationChipStyles = (isDarkMode: boolean) => ({
  fontSize: '0.75rem',
  backgroundColor: isDarkMode ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
});

export const modeToggleContainerStyles = {
  mb: 3, 
  textAlign: 'center'
};

export const modeChipContainerStyles = {
  mt: 2
};

export const enhancedValidationContainerStyles = {
  mt: 2
};

export const progressContainerStyles = {
  width: '100%', 
  mb: 3
};

export const selectedFileContainerStyles = {
  width: '100%', 
  textAlign: 'center'
};

export const uploadButtonsContainerStyles = {
  display: 'flex', 
  gap: 2, 
  justifyContent: 'center'
}; 
 