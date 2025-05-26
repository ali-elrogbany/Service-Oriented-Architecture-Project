import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentMethod } from '../dto/create-settlement.dto';
import { SettlementStatus } from '../dto/update-settlement.dto';

@Schema({ timestamps: true })
export class Settlement extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Courier', required: true })
  courierId: string;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;

  @Prop({ required: true, default: 0 })
  totalAmount: number;

  @Prop({ required: true, default: 0 })
  transactionCount: number;

  @Prop({
    type: String,
    enum: SettlementStatus,
    default: SettlementStatus.PENDING,
  })
  status: SettlementStatus;

  @Prop({
    type: String,
    enum: PaymentMethod,
    required: true,
  })
  paymentMethod: PaymentMethod;

  @Prop({ type: Object, required: true })
  paymentDetails: Record<string, any>;

  @Prop()
  processedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  notes: string;
}

export const SettlementSchema = SchemaFactory.createForClass(Settlement);

// Create indexes
SettlementSchema.index({ courierId: 1, periodStart: 1, periodEnd: 1 });
SettlementSchema.index({ status: 1 });
