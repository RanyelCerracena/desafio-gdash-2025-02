import { Test, TestingModule } from '@nestjs/testing';
import { WeatherLogsController } from './weather-logs.controller';

describe('WeatherLogsController', () => {
  let controller: WeatherLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherLogsController],
    }).compile();

    controller = module.get<WeatherLogsController>(WeatherLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
