import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';
import { Refund, RefundSchema } from './schemas/refund.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Refund.name, schema: RefundSchema }]),
  ],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}
