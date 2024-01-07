import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Garden } from './garden.schema';
import { Device } from './device.schema';

export type ZoneDocument = HydratedDocument<Zone>;

@Schema({ timestamps: true })
export class Zone {
  @Prop()
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

  @Prop({ default: null })
  irrigationStartTime: Date;

  @Prop({ default: 0 })
  waterAmount: number;

  @Prop({ default: null })
  lightStartTime: Date;

  @Prop({ default: 0 })
  lightTime: number;

  @Prop({ default: 0 })
  minHumidity: number;

  @Prop({ default: 0 })
  maxHumidity: number;

  @Prop({ default: 0 })
  minTemperature: number;

  @Prop({ default: 0 })
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
  tempThresholdNoti: boolean;

  @Prop({ default: false })
  humidThresholdNoti: boolean;
}

export const ZoneSchema = SchemaFactory.createForClass(Zone);
