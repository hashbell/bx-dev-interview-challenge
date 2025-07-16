import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from '@/database/entities/user.entity';
import { CreateUserDto } from '@auth/dto/create-user.dto';
import { IUserRepository } from '@/shared/interfaces/user.interface';

describe('UserRepository', () => {
  let repository: IUserRepository;
  let userRepository: jest.Mocked<Repository<UserEntity>>;

  const mockUser: UserEntity = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword123',
    name: 'Test User',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'USER_REPOSITORY',
          useClass: UserRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<IUserRepository>('USER_REPOSITORY');
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  describe('create', () => {
    it('should create and return a user entity', async () => {
      userRepository.save.mockResolvedValue(mockUser);

      const result = await repository.create(mockCreateUserDto);

      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockCreateUserDto.email,
          password: mockCreateUserDto.password,
          name: mockCreateUserDto.name,
        })
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';

    it('should return user when found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {

      userRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
    });
  });
}); 
