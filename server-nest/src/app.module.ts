import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { CourierModule } from './courier/courier.module';
import { RefundsModule } from './refunds/refunds.module';
import { SettlementsModule } from './settlements/settlements.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://alielrogbany:alielrogbany1234@uni.a4gz8mo.mongodb.net/?retryWrites=true&w=majority&appName=Uni',
    ),
    UsersModule,
    TransactionsModule,
    AuditLogsModule,
    CourierModule,
    RefundsModule,
    SettlementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
