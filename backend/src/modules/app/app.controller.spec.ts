 import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { MessageDto } from './dto/message.dto';
import { IAppService } from './services/app.service.interface';
import { Mapper } from '@/common/utils/mapper/mapper';
import { MessageEntity } from './dto/message.entity';

jest.mock('@/common/utils/mapper/mapper');

describe('AppController', () => {
  let appController: AppController;
  let appService: jest.Mocked<AppService>;

  const mockAppService = {
    getHello: jest.fn(),
  } as unknown as jest.Mocked<IAppService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get(AppService);

    jest.spyOn(Mapper, 'mapData').mockImplementation();
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should call the service', () => {
      appController.getHello();
      expect(appService.getHello).toHaveBeenCalledWith();
    });

    it('should call the mapper with the result from the service', () => {
      const message = 'Hello World!';
      const resultFromService = new MessageEntity(message);
      appService.getHello.mockReturnValue(resultFromService);

      appController.getHello();

      expect(Mapper.mapData).toHaveBeenCalledWith(
        MessageDto,
        resultFromService,
      );
    });

    it('should return the value from the mapper', () => {
      const resultFromService = new MessageEntity('any message');
      const expectedResult = new MessageDto('any dto');

      appService.getHello.mockReturnValue(resultFromService);
      jest.spyOn(Mapper, 'mapData').mockReturnValue(expectedResult);

      const result = appController.getHello();

      expect(result).toBe(expectedResult);
    });
  });
});