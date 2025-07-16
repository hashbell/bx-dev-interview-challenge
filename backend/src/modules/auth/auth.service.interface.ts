import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth.dto';

export interface IAuthService {
  login(loginDto: LoginDto): Promise<LoginResponseDto>;
  register(email: string, password: string, name: string): Promise<RegisterResponseDto>;
  validateUser(email: string, password: string): Promise<any>;
}

// Injection token for IAuthService
export const AUTH_SERVICE = 'AUTH_SERVICE'; 
