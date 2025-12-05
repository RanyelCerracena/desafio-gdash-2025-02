import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './weather-logs.schema';
import { CreateWeatherLogDto } from '../users/dto/create-user.dto';

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

  async findAll(): Promise<WeatherLogDocument[]> {
    return await this.weatherLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }
}
