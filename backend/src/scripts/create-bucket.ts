import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CreateBucketCommand } from '../commands/create-bucket.command';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  providers: [CreateBucketCommand],
})
class CreateBucketModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CreateBucketModule);

  const createBucketCommand = app.get(CreateBucketCommand);
  
  try {
    await createBucketCommand.execute();
    console.log('✅ Bucket creation completed successfully');
  } catch (error: any) {
    console.error('❌ Failed to create bucket:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap(); 
