import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { IAuthService, AUTH_SERVICE } from './auth.service.interface';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, RegisterResponseDto, UserResponseDto } from './dto/auth.dto';
import { USER_REPOSITORY, IUserRepository } from '../../shared/interfaces/user.interface';
import { Mapper } from '@/common/utils/mapper/mapper';

// Mock bcrypt
jest.mock('bcrypt');

// Mock Mapper
jest.mock('@/common/utils/mapper/mapper');

describe('AuthService', () => {
  let service: IAuthService;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let mockMapper: jest.Mocked<typeof Mapper>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  const mockUserResponse = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AUTH_SERVICE,
          useClass: AuthService,
        },
        {
          provide: USER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IAuthService>(AUTH_SERVICE);
    userRepository = module.get(USER_REPOSITORY);
    jwtService = module.get(JwtService);
    mockMapper = Mapper as jest.Mocked<typeof Mapper>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login a user with valid credentials', async () => {
      // Arrange
      const mockToken = 'mock.jwt.token';
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockToken);
      mockMapper.mapToInstance.mockReturnValue(mockUserResponse);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        access_token: mockToken,
        user: mockUserResponse,
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    const email = 'newuser@example.com';
    const password = 'newpassword123';
    const name = 'New User';

    it('should successfully register a new user', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const mockToken = 'mock.jwt.token';
      const newUser = { ...mockUser, id: 2, email, name, password: hashedPassword };
      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue(mockToken);
      mockMapper.mapToInstance.mockReturnValue(mockUserResponse);

      // Act
      const result = await service.register(email, password, name);

      // Assert
      expect(result).toEqual({
        access_token: mockToken,
        user: mockUserResponse,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: newUser.id, email: newUser.email });
    });

    it('should throw ConflictException when user already exists', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(email, password, name)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should return user without password when credentials are valid', async () => {
      // Arrange
      const { password: _, ...userWithoutPassword } = mockUser;
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toEqual(userWithoutPassword);
    });

    it('should return null when user does not exist', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toBeNull();
    });
  });
}); 
