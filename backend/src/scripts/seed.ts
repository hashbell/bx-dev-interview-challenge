import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeeder } from '../seeds/user.seeder';
import { UserEntity } from '../database/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD ,
      database: process.env.DB_DATABASE,
      entities: [UserEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserSeeder],
})
class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const userSeeder = app.get(UserSeeder);
  
  try {
    await userSeeder.seed();
    console.log('✅ Database seeding completed successfully');
  } catch (error: any) {
    console.error('❌ Failed to seed database:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap(); 
