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

interface RegisterFormProps {
  isDarkMode: boolean;
  onToggleForm: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ isDarkMode, onToggleForm }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
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
      await register({ name, email, password });
      setSuccess('Registration successful! You are now signed in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={formContainerStyles(isDarkMode)}>
      <Typography variant="h4" sx={authTitleStyles(isDarkMode)}>
        Create Account
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
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          sx={textFieldStyles(isDarkMode)}
        />
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
        <Button
          onClick={onToggleForm}
          sx={toggleButtonStyles(isDarkMode)}
        >
          Already have an account? Sign in
        </Button>
      </Box>
    </Box>
  );
}; 
