import { UserEntity } from '@database/entities/user.entity';
import { CreateUserDto } from '../../modules/auth/dto/create-user.dto';

export interface IUserRepository {
  create(data: CreateUserDto): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
}

export interface IUserService {
  createUser(email: string, password: string, name: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  validateUser(email: string, password: string): Promise<UserEntity | null>;
}

// User injection tokens
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const USER_SERVICE = 'USER_SERVICE'; 
