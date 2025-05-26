import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settlement } from './schemas/settlement.schema';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { SettlementStatus } from './dto/update-settlement.dto';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class SettlementsService {
  constructor(
    @InjectModel(Settlement.name) private settlementModel: Model<Settlement>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(createSettlementDto: CreateSettlementDto): Promise<Settlement> {
    const {
      courierId,
      periodStart,
      periodEnd,
      paymentMethod,
      paymentDetails,
      userId,
    } = createSettlementDto;

    // Calculate total amount and transaction count for the period
    const transactions = await this.transactionModel.find({
      userId: courierId,
      createdAt: { $gte: periodStart, $lte: periodEnd },
      type: 'credit', // Assuming credit transactions are completed deliveries
    });

    const totalAmount = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    const settlement = new this.settlementModel({
      courierId,
      periodStart,
      periodEnd,
      totalAmount,
      transactionCount: transactions.length,
      paymentMethod,
      paymentDetails,
    });

    const savedSettlement = await settlement.save();

    // Create audit log for settlement creation
    await this.auditLogsService.create({
      action: 'CREATE_SETTLEMENT',
      user_id: userId,
    });

    return savedSettlement;
  }

  async getCourierSettlements(courierId: string): Promise<Settlement[]> {
    return this.settlementModel
      .find({ courierId })
      .sort({ periodStart: -1 })
      .exec();
  }

  async getSettlementDetails(id: string): Promise<Settlement> {
    const settlement = await this.settlementModel.findById(id).exec();
    if (!settlement) {
      throw new NotFoundException(`Settlement with ID ${id} not found`);
    }
    return settlement;
  }

  async updateStatus(
    id: string,
    updateSettlementDto: UpdateSettlementDto,
  ): Promise<Settlement> {
    const { status, notes, userId } = updateSettlementDto;

    const settlement = await this.settlementModel.findById(id);
    if (!settlement) {
      throw new NotFoundException(`Settlement with ID ${id} not found`);
    }

    settlement.status = status;
    if (status === SettlementStatus.PROCESSING) {
      settlement.processedAt = new Date();
    } else if (status === SettlementStatus.COMPLETED) {
      settlement.completedAt = new Date();
    }
    if (notes) {
      settlement.notes = notes;
    }

    const updatedSettlement = await settlement.save();

    // Create audit log for settlement status update
    await this.auditLogsService.create({
      action: 'UPDATE_SETTLEMENT_STATUS',
      user_id: userId,
    });

    return updatedSettlement;
  }
}
