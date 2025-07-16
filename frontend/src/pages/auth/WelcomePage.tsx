import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ThemeMode } from '../../types';

interface WelcomePageProps {
  mode: ThemeMode;
  onLogin: () => void;
  onRegister: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ mode, onLogin, onRegister }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper className={mode === 'light' ? "glass-effect" : "glass-effect-dark"} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h3" className="gradient-text" gutterBottom sx={{ mb: 3 }}>
          ✨ BonusX Cloud
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
          Secure File Management & Storage
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
          Experience the future of file management with our advanced cloud storage solution.
          Upload, organize, and access your files from anywhere with enterprise-grade security.
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={onLogin}
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              }
            }}
          >
            🔐 Sign In
          </Button>
          <Button 
            variant="outlined" 
            onClick={onRegister}
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              borderWidth: '2px',
              color: '#6366f1',
              borderColor: '#6366f1',
              '&:hover': {
                borderWidth: '2px',
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
              }
            }}
          >
            🚀 Get Started
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}; 
