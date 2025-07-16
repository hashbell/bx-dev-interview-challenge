import { SxProps, Theme } from '@mui/material';

// App container styles
export const appContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  minHeight: '100vh',
  background: isDarkMode 
    ? 'radial-gradient(ellipse at top, #0f172a 0%, #1e293b 50%, #334155 100%)'
    : 'radial-gradient(ellipse at top, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  backgroundAttachment: 'fixed',
  fontFamily: "'Inter', sans-serif",
  position: 'relative',
  overflow: 'hidden',
});

// Main content container styles
export const mainContentStyles: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  p: 3,
  pt: 16,
  pb: 4,
};

// Content container styles
export const contentContainerStyles: SxProps<Theme> = {
  width: '100%',
  maxWidth: '1200px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4, // vertical spacing between sections
  alignItems: 'stretch',
  minHeight: 'calc(100vh - 120px)', // Ensure minimum height for content
};

// Header styles
export const headerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  background: isDarkMode 
    ? 'rgba(30, 41, 59, 0.85)' 
    : 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${isDarkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  boxShadow: isDarkMode 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
});

export const headerContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  p: 2,
  maxWidth: '1200px',
  mx: 'auto',
};

export const logoStyles: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '1.5rem',
};

export const themeToggleButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  borderRadius: '50%',
  minWidth: 'auto',
  width: 40,
  height: 40,
  '&:hover': {
    background: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
  },
});

// Auth container styles
export const authContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  p: 3,
  background: isDarkMode 
    ? 'radial-gradient(ellipse at top, #0f172a 0%, #1e293b 50%, #334155 100%)'
    : 'radial-gradient(ellipse at top, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  backgroundAttachment: 'fixed',
});

export const authFormContainerStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  width: '100%',
  maxWidth: '400px',
  p: 4,
  background: isDarkMode 
    ? 'rgba(30, 41, 59, 0.85)' 
    : 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${isDarkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '20px',
  boxShadow: isDarkMode 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
});

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

export const authFormStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export const authTextFieldStyles = (isDarkMode: boolean): SxProps<Theme> => ({
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

export const authButtonStyles: SxProps<Theme> = {
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

export const authToggleButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
  mt: 2,
  color: isDarkMode ? '#94a3b8' : '#64748b',
  textTransform: 'none',
  fontSize: '0.9rem',
  '&:hover': {
    background: 'transparent',
    color: '#667eea',
  },
});

export const authAlertStyles: SxProps<Theme> = {
  mb: 2,
  borderRadius: '12px',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
};

export const authSuccessAlertStyles: SxProps<Theme> = {
  mb: 2,
  borderRadius: '12px',
  background: 'rgba(20, 184, 166, 0.1)',
  border: '1px solid rgba(20, 184, 166, 0.3)',
};

// Organic shapes styles
export const organicShapeStyles = (index: number): SxProps<Theme> => ({
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(1px)',
  opacity: 0.6,
  animation: 'float 8s ease-in-out infinite',
  animationDelay: `${index * 2}s`,
  ...(index === 1 && {
    width: '120px',
    height: '120px',
    background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
    top: '15%',
    left: '10%',
  }),
  ...(index === 2 && {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(45deg, #48dbfb, #0abde3)',
    top: '25%',
    right: '20%',
  }),
  ...(index === 3 && {
    width: '100px',
    height: '100px',
    background: 'linear-gradient(45deg, #ff9ff3, #f368e0)',
    bottom: '20%',
    left: '15%',
  }),
  ...(index === 4 && {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(45deg, #1dd1a1, #10ac84)',
    bottom: '30%',
    right: '10%',
  }),
});

// Custom CSS animations
export const customCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
      opacity: 0.6;
    }
    25% { 
      transform: translateY(-20px) rotate(90deg); 
      opacity: 0.8;
    }
    50% { 
      transform: translateY(-10px) rotate(180deg); 
      opacity: 0.4;
    }
    75% { 
      transform: translateY(-15px) rotate(270deg); 
      opacity: 0.7;
    }
  }

  .pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite alternate;
  }

  @keyframes pulse-glow {
    from {
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
    }
    to {
      box-shadow: 0 0 40px rgba(102, 126, 234, 0.8);
    }
  }

  .text-glow {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .button-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .button-hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .button-hover:hover::before {
    left: 100%;
  }
`; 
