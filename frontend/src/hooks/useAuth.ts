import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import { LoginRequest, RegisterRequest, User, UseAuthReturn } from '../types';

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const authService = new AuthService();

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
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

  return {
    isAuthenticated,
    currentUser,
    login,
    register,
    logout,
  };
}; 
