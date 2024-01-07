import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true })
export class Device {
  @Prop({ unique: true })
  macAddress: string;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
