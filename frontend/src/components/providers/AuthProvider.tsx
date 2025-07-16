import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, RegisterRequest, User } from '../../types';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();

  useEffect(() => {
    const validateAuth = async () => {
      const token = authService.getToken();
      const user = authService.getCurrentUser();
      
      // If no token or user data exists, immediately show login page
      if (!token || !user) {
        authService.logout(); // Clear any partial data
        setIsAuthenticated(false);
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      // Only validate token if both token and user exist
      try {
        const isValid = await authService.validateToken(token);
        if (isValid) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        } else {
          // Clear invalid token
          authService.logout();
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        // Clear invalid token and show login page
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setIsLoading(false);
    };

    validateAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    const response = await authService.login(credentials);
    setIsAuthenticated(true);
    setCurrentUser(response.user);
  }, []);

  const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
    const response = await authService.register(userData);
    setIsAuthenticated(true);
    setCurrentUser(response.user);
  }, []);

  const logout = useCallback((): void => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  const value = {
    isAuthenticated,
    currentUser,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
