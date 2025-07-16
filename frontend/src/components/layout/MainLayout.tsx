import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Brightness4, Brightness7, Logout } from '@mui/icons-material';
import { FileUpload } from '../FileUpload';
import { FileList } from '../FileList';
import { useTheme } from '../providers/ThemeProvider';
import { 
  appContainerStyles, 
  mainContentStyles, 
  contentContainerStyles,
  headerStyles,
  headerContainerStyles,
  logoStyles,
  themeToggleButtonStyles,
} from '../../styles/app.styles';

interface MainLayoutProps {
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileUploaded = () => {
    // Trigger refresh of file list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box sx={appContainerStyles(isDarkMode)}>
      {/* Header */}
      <AppBar position="fixed" sx={headerStyles(isDarkMode)}>
        <Toolbar sx={headerContainerStyles}>
          <Typography variant="h6" sx={logoStyles}>
            BonusX Cloud Storage
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={toggleTheme}
              sx={themeToggleButtonStyles(isDarkMode)}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton
              onClick={onLogout}
              sx={themeToggleButtonStyles(isDarkMode)}
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={mainContentStyles}>
        <Box sx={contentContainerStyles}>
          <FileUpload onFileUploaded={handleFileUploaded} isDarkMode={isDarkMode} />
          <FileList isDarkMode={isDarkMode} refreshTrigger={refreshTrigger} />
        </Box>
      </Box>
    </Box>
  );
}; 
