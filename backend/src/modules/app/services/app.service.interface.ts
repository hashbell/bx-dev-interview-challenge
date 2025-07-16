import { IMessageEntity } from '../dto/message.entity';

export interface IAppService {
  getHello(): IMessageEntity;
}
