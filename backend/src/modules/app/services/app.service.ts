import { Injectable } from '@nestjs/common';
import { IMessageEntity, MessageEntity } from '../dto/message.entity';
import { IAppService } from './app.service.interface';

@Injectable()
export class AppService implements IAppService {
  getHello(): IMessageEntity {
    const message = "I'm Mr. Meeseeks, look at me!";

    const entity = new MessageEntity(message);
    return entity;
  }
}
