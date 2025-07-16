import React from 'react';
import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';
import { ThemeMode } from '../types';
import { ThemeToggle } from '../components/ui/ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
  mode: ThemeMode;
  onToggleTheme: () => void;
  isAuthenticated: boolean;
  currentUser: { name: string } | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  mode,
  onToggleTheme,
  isAuthenticated,
  currentUser,
  onLogin,
  onRegister,
  onLogout,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ✨ BonusX Cloud
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeToggle mode={mode} onToggle={onToggleTheme} />
            {isAuthenticated ? (
              <>
                <Typography variant="body2">
                  Welcome, {currentUser?.name}
                </Typography>
                <Button color="inherit" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={onLogin}>
                  Login
                </Button>
                <Button color="inherit" onClick={onRegister}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
}; 
