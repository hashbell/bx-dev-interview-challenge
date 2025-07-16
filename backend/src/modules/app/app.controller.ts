import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './services/app.service';
import { Mapper } from '@/common/utils/mapper/mapper';
import { IMessageDto, MessageDto } from '@/modules/app/dto/message.dto';
import { Public } from '@/common/decorators/public.decorator';

@Controller('hello')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): IMessageDto {
    const entity = this.appService.getHello();

    const dto = Mapper.mapData(MessageDto, entity);
    return dto;
  }
}
