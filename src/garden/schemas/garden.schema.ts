import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Zone } from './zone.schema';

export type GardenDocument = HydratedDocument<Garden>;

@Schema({ timestamps: true })
export class Garden {
  @Prop()
  gardenName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Zone' })
  zones: Zone[];
}

export const GardenSchema = SchemaFactory.createForClass(Garden);
