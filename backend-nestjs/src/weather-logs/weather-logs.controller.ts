import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WeatherLogsService } from './weather-logs.service';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';

@Controller('api/weather/logs')
export class WeatherLogsController {
  constructor(private readonly weatherLogsService: WeatherLogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createLog(@Body() createWeatherLogDto: CreateWeatherLogDto) {
    const savedLog = await this.weatherLogsService.create(createWeatherLogDto);
    return {
      message: 'Log de clima recebido e salvo com sucesso.',
      data: savedLog,
    };
  }
}
