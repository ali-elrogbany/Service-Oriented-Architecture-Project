import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CourierStatus } from '../dto/create-courier.dto';

@Schema({ timestamps: true })
export class Courier extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true, enum: CourierStatus, default: CourierStatus.ACTIVE })
  status: CourierStatus;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CourierSchema = SchemaFactory.createForClass(Courier);
