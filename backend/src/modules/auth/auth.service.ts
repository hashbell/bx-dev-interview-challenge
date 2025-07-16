import { Injectable, UnauthorizedException, ConflictException, Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, RegisterResponseDto, UserResponseDto } from './dto/auth.dto';
import { USER_REPOSITORY, IUserRepository } from '../../shared/interfaces/user.interface';
import { Mapper } from '@/common/utils/mapper/mapper';
import { IAuthService } from './auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    this.logger.log(`Login successful for user: ${user.id}`);

    return {
      access_token,
      user: Mapper.mapToInstance(UserResponseDto, user),
    };
  }

  async register(email: string, password: string, name: string): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    this.logger.log(`Registration successful for user: ${user.id}`);

    return {
      user: Mapper.mapToInstance(UserResponseDto, user),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
} 
