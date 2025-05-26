import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { Refund } from './schemas/refund.schema';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post()
  async create(@Body() createRefundDto: CreateRefundDto): Promise<Refund> {
    return this.refundsService.create(createRefundDto);
  }

  @Get()
  async findAll(): Promise<Refund[]> {
    return this.refundsService.findAll();
  }

  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateRefundDto: UpdateRefundDto,
  ): Promise<Refund> {
    return this.refundsService.updateStatus(id, updateRefundDto);
  }
}
