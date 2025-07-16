import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async seed(): Promise<void> {
    console.log('Starting user seeding...');
    const existingUser = await this.usersRepository.findOne({
      where: { email: 'test@example.com' },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Test123!', 10);
      const user = new UserEntity('test@example.com', hashedPassword, 'Test User');

      await this.usersRepository.save(user);
      console.log('✅ Test user created: test@example.com / Test123!');
    } else {
      console.log('ℹ️ Test user already exists');
    }
  }
} 
