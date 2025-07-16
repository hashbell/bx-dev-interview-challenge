import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useAuth } from '../providers/AuthProvider';
import {
  formContainerStyles,
  authTitleStyles,
  formStyles,
  textFieldStyles,
  submitButtonStyles,
  toggleButtonStyles,
  errorAlertStyles,
  successAlertStyles,
} from '../../styles/auth.styles';

interface LoginFormProps {
  isDarkMode: boolean;
  onToggleForm: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isDarkMode, onToggleForm }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await login({ email, password });
      setSuccess('Login successful!');
      // The AuthProvider will automatically update the authentication state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={formContainerStyles(isDarkMode)}>
      <Typography variant="h4" sx={authTitleStyles(isDarkMode)}>
        Welcome Back
      </Typography>
      
      {error && (
        <Alert severity="error" sx={errorAlertStyles}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={successAlertStyles}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          sx={textFieldStyles(isDarkMode)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          sx={textFieldStyles(isDarkMode)}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={submitButtonStyles}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
        <Button
          onClick={onToggleForm}
          sx={toggleButtonStyles(isDarkMode)}
        >
          Don't have an account? Sign up
        </Button>
      </Box>
    </Box>
  );
}; 
