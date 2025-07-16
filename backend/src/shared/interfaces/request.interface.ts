import { Request } from 'express';
import { JwtUser } from '../types/jwt.types';

export interface AuthenticatedRequest extends Request {
  user?: JwtUser;
} 
