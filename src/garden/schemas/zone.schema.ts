import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Garden } from './garden.schema';
import { Device } from './device.schema';

export type ZoneDocument = HydratedDocument<Zone>;

@Schema({ timestamps: true })
export class Zone {
  @Prop({ require: true })
  plant: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garden',
    required: true,
  })
  garden: Garden;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  })
  device: Device;

  irrigationStartTime: Date;

  waterAmount: number;

  lightStartTime: Date;

  lightTime: number;

  minHumidity: number;

  maxHumidity: number;

  minTemperature: number;

  maxTemperature: number;

  @Prop({ default: false })
  isLightOn: boolean;

  @Prop({ default: false })
  isWatering: boolean;

  @Prop({ default: false })
  isAutoLight: boolean;

  @Prop({ default: false })
  isAutoWater: boolean;

  @Prop({ default: false })
  thresholdNoti: boolean;
}

export const ZoneSchema = SchemaFactory.createForClass(Zone);
