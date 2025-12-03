import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './weather-logs.schema';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';

@Injectable()
export class WeatherLogsService {
  constructor(
    @InjectModel(WeatherLog.name)
    private weatherLogModel: Model<WeatherLogDocument>,
  ) {}

  async create(
    createWeatherLogDto: CreateWeatherLogDto,
  ): Promise<WeatherLogDocument> {
    const createdLog = new this.weatherLogModel(createWeatherLogDto);
    return await createdLog.save();
  }
}
