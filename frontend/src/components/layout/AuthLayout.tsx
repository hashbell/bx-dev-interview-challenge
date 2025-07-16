import React, { useState } from 'react';
import { Box } from '@mui/material';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import { useTheme } from '../providers/ThemeProvider';
import { organicShapeStyles, customCSS } from '../../styles/app.styles';

export const AuthLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleRegister = () => {
    setIsLogin(true);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Organic shapes for background decoration */}
      <Box sx={organicShapeStyles(1)} />
      <Box sx={organicShapeStyles(2)} />
      <Box sx={organicShapeStyles(3)} />
      <Box sx={organicShapeStyles(4)} />

      {/* Custom CSS for animations */}
      <style>{customCSS}</style>

      {/* Auth content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        {isLogin ? (
          <LoginForm 
            isDarkMode={isDarkMode} 
            onToggleForm={handleToggleForm}
          />
        ) : (
          <RegisterForm 
            onRegister={handleRegister} 
            isDarkMode={isDarkMode} 
            onToggleForm={handleToggleForm}
          />
        )}
      </Box>
    </Box>
  );
}; 
