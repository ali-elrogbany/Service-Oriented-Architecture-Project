import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['credit', 'debit'] })
  type: string;

  @Prop()
  description: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
