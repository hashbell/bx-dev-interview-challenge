import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address (must be unique)',
    example: 'newuser@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'securepassword123',
    minLength: 8,
    type: String,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User full name (minimum 2 characters)',
    example: 'John Doe',
    minLength: 2,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
} 
