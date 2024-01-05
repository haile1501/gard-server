import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Zone } from './zone.schema';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true })
export class Device {
  @Prop({ unique: true })
  macAddress: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Zone' })
  zone: Zone;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
