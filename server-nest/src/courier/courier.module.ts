import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourierController } from './courier.controller';
import { CourierService } from './courier.service';
import { Courier, CourierSchema } from './entities/courier.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Courier.name, schema: CourierSchema }]),
    AuditLogsModule,
  ],
  controllers: [CourierController],
  providers: [CourierService],
  exports: [CourierService],
})
export class CourierModule {}
