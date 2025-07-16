import { SxProps, Theme } from '@mui/material';

// Container styles
export const authContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: isDarkMode 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  p: 3,
});

// Form container styles
export const formContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  width: '100%',
  maxWidth: '400px',
  p: 4,
  background: isDarkMode 
    ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(30, 30, 60, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(24px)',
  border: `2px solid ${isDarkMode 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
});

// Title styles
export const authTitleStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mb: 3,
  textAlign: 'center',
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

// Form styles
export const formStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

// Text field styles
export const textFieldStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: isDarkMode 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(255, 255, 255, 0.8)',
    border: `1px solid ${isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(102, 126, 234, 0.3)',
    },
    '&.Mui-focused': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    color: isDarkMode ? '#94a3b8' : '#64748b',
    '&.Mui-focused': {
      color: '#667eea',
    },
  },
  '& .MuiInputBase-input': {
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    '&::placeholder': {
      color: isDarkMode ? '#94a3b8' : '#64748b',
      opacity: 1,
    },
  },
});

// Button styles
export const submitButtonStyles: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  py: 1.5,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'none',
    boxShadow: 'none',
  },
};

// Toggle button styles
export const toggleButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mt: 2,
  color: isDarkMode ? '#94a3b8' : '#64748b',
  textTransform: 'none',
  fontSize: '0.9rem',
  '&:hover': {
    background: 'transparent',
    color: '#667eea',
  },
});

// Alert styles
export const errorAlertStyles: SxProps<Theme> = {
  mb: 2,
  borderRadius: '12px',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
};

export const successAlertStyles: SxProps<Theme> = {
  mb: 2,
  borderRadius: '12px',
  background: 'rgba(20, 184, 166, 0.1)',
  border: '1px solid rgba(20, 184, 166, 0.3)',
}; 
