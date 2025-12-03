import { Module } from '@nestjs/common';
import { WeatherLogsModule } from './weather-logs/weather-logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    }),
    WeatherLogsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
