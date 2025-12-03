import { Module } from '@nestjs/common';
import { WeatherLogsController } from './weather-logs.controller';
import { WeatherLogsService } from './weather-logs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherLog, WeatherLogSchema } from './weather-logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherLog.name, schema: WeatherLogSchema },
    ]),
  ],
  controllers: [WeatherLogsController],
  providers: [WeatherLogsService],
  exports: [WeatherLogsService, MongooseModule],
})
export class WeatherLogsModule {}
