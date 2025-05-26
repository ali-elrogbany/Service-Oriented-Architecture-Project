import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettlementsController } from './settlements.controller';
import { SettlementsService } from './settlements.service';
import { Settlement, SettlementSchema } from './schemas/settlement.schema';
import {
  Transaction,
  TransactionSchema,
} from '../transactions/schemas/transaction.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settlement.name, schema: SettlementSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    AuditLogsModule,
  ],
  controllers: [SettlementsController],
  providers: [SettlementsService],
})
export class SettlementsModule {}
