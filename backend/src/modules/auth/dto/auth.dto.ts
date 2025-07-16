import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 1,
  })
  @Expose()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'test@example.com',
  })
  @Expose()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Expose()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  @Exclude()
  password?: string;
} 


export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  @IsString()
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  @Expose()
  user: UserResponseDto;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  @Expose()
  user: UserResponseDto;
}

