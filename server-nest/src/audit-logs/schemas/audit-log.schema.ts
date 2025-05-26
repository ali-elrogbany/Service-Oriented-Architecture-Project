import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  action: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongooseSchema.Types.ObjectId;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
