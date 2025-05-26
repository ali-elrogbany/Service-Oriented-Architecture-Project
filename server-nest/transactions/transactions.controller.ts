import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schemas/transaction.schema';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Transaction[]> {
    return this.transactionsService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findById(id);
  }
}
