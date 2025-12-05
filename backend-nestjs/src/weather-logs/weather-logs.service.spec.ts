import { Test, TestingModule } from '@nestjs/testing';
import { WeatherLogsService } from './weather-logs.service';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';

describe('WeatherLogsService', () => {
  let service: WeatherLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherLogsService],
    }).compile();

    service = module.get<WeatherLogsService>(WeatherLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
