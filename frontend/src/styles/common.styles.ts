import { SxProps, Theme } from '@mui/material';

// Common container styles
export const pageContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  minHeight: '100vh',
  background: isDarkMode 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  p: 3,
});

export const contentContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  maxWidth: '1200px',
  mx: 'auto',
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: 4,
  alignItems: 'start',
  // Dark mode can be used for future styling variations
  ...(isDarkMode && {}),
});

// Common card styles
export const cardStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  background: isDarkMode 
    ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(30, 30, 60, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(24px)',
  border: `2px solid ${isDarkMode 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
});

// Common button styles
export const primaryButtonStyles: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  px: 3,
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

export const secondaryButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  borderRadius: '12px',
  px: 3,
  py: 1.5,
  fontSize: '1rem',
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

// Common typography styles
export const titleStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

export const subtitleStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: isDarkMode ? '#94a3b8' : '#64748b',
  fontWeight: 500,
});

export const bodyTextStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  lineHeight: 1.6,
});

// Common alert styles
export const errorAlertStyles: SxProps<Theme> = {
  borderRadius: '12px',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
};

export const successAlertStyles: SxProps<Theme> = {
  borderRadius: '12px',
  background: 'rgba(20, 184, 166, 0.1)',
  border: '1px solid rgba(20, 184, 166, 0.3)',
};

export const warningAlertStyles: SxProps<Theme> = {
  borderRadius: '12px',
  background: 'rgba(245, 158, 11, 0.1)',
  border: '1px solid rgba(245, 158, 11, 0.3)',
};

export const infoAlertStyles: SxProps<Theme> = {
  borderRadius: '12px',
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.3)',
};

// Common loading styles
export const loadingContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: 3,
};

export const loadingSpinnerStyles: SxProps<Theme> = {
  color: '#667eea',
};

// Common animation styles
export const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const slideInAnimation = `
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
`;

export const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

// Common hover effects
export const hoverLiftEffect: SxProps<Theme> = {
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
};

export const hoverScaleEffect: SxProps<Theme> = {
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}; 
