import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, RegisterResponseDto, UserResponseDto } from './dto/auth.dto';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

// Mock the LocalAuthGuard
jest.mock('./guards/local-auth.guard');

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: jest.Mocked<AuthService>;

  const mockUser: UserResponseDto = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  const mockLoginResponse: LoginResponseDto = {
    access_token: 'mock-jwt-token',
    user: mockUser,
  };

  const mockRegisterResponse: RegisterResponseDto = {
    user: mockUser,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(LocalAuthGuard)
    .useValue({
      canActivate: jest.fn(() => true),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    
    // Add validation pipe for proper request validation
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    
    await app.init();
    authService = moduleFixture.get(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return 200 with access token and user data', async () => {
      // Arrange
      authService.login.mockResolvedValue(mockLoginResponse);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return 401 when login fails', async () => {
      // Arrange
      authService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return 400 when email is missing', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'password123' })
        .expect(400);
    });

    it('should return 400 when password is missing', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);
    });

    it('should return 400 when email is invalid', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid-email', password: 'password123' })
        .expect(400);
    });

    it('should return 400 when password is too short', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'short' })
        .expect(400);
    });
  });

  describe('POST /auth/register', () => {
    const registerDto: RegisterDto = {
      email: 'newuser@example.com',
      password: 'securepassword123',
      name: 'New User',
    };

    it('should return 201 with user data', async () => {
      // Arrange
      authService.register.mockResolvedValue(mockRegisterResponse);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
      });
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
    });

    it('should return 409 when user already exists', async () => {
      // Arrange
      authService.register.mockRejectedValue(new ConflictException('User already exists'));

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.body.message).toBe('User already exists');
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
    });

    it('should return 400 when email is missing', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ password: 'securepassword123', name: 'New User' })
        .expect(400);
    });

    it('should return 400 when password is missing', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'newuser@example.com', name: 'New User' })
        .expect(400);
    });

    it('should return 400 when name is missing', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'newuser@example.com', password: 'securepassword123' })
        .expect(400);
    });

    it('should return 400 when email is invalid', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'invalid-email', password: 'securepassword123', name: 'New User' })
        .expect(400);
    });

    it('should return 400 when password is too weak', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'newuser@example.com', password: 'weak', name: 'New User' })
        .expect(400);
    });

    it('should return 400 when name is too short', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'newuser@example.com', password: 'securepassword123', name: 'A' })
        .expect(400);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return 404 for non-existent endpoint', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(404);
    });
  });
}); 
