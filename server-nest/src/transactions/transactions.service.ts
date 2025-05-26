import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(createTransactionDto);
    const savedTransaction = await createdTransaction.save();

    // Create audit log for the transaction
    await this.auditLogsService.create({
      action: `Create Transaction ${createTransactionDto.type} of ${createTransactionDto.amount} EGP`,
      user_id: createTransactionDto.userId,
    });

    return savedTransaction;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
