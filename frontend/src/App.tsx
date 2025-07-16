import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import { AppThemeProvider } from './components/providers/ThemeProvider';
import { AuthProvider } from './components/providers/AuthProvider';
import { AuthLayout } from './components/layout/AuthLayout';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './components/providers/AuthProvider';
import { fadeInAnimation } from './styles/common.styles';
import { Box, CircularProgress } from '@mui/material';

// Global styles
const globalStyles = `
  ${fadeInAnimation}
`;

function AppContent() {
  const { isAuthenticated, logout, isLoading } = useAuth();

  // Show loading spinner while validating authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>
      {isAuthenticated ? (
        <MainLayout onLogout={logout} />
      ) : (
        <AuthLayout />
      )}
    </>
  );
}

function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App; 
