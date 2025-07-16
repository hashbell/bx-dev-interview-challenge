import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { ThemeToggleProps } from '../../types';
import { themeToggleButtonStyles } from '../../styles/themeToggle.styles';

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ mode, onToggle }) => {
  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <Button
        color="inherit"
        onClick={onToggle}
        sx={themeToggleButtonStyles}
      >
        {mode === 'light' ? '🌙' : '☀️'}
      </Button>
    </Tooltip>
  );
}; 
