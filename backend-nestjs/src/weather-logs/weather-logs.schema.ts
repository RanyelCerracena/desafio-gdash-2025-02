import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema({ timestamps: true })
export class WeatherLog {
  @Prop({ required: true, index: true })
  location: string;

  @Prop({ required: true, type: Number })
  temperature: number;

  @Prop({ required: true, type: Number })
  wind_velocity: number;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ type: Object, default: {} })
  insights: object;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
