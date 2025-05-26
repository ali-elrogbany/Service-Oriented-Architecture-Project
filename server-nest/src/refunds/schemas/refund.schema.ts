import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RefundStatus } from '../dto/update-refund.dto';

@Schema({ timestamps: true })
export class Refund extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  })
  transactionId: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  reason: string;

  @Prop({ type: String, enum: RefundStatus, default: RefundStatus.PENDING })
  status: RefundStatus;

  @Prop({ default: Date.now })
  requestedAt: Date;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);
