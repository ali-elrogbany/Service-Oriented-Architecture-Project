import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { SettlementsService } from './settlements.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { Settlement } from './schemas/settlement.schema';

@Controller('settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post()
  async create(
    @Body() createSettlementDto: CreateSettlementDto,
  ): Promise<Settlement> {
    return this.settlementsService.create(createSettlementDto);
  }

  @Get('courier/:courierId')
  async getCourierSettlements(
    @Param('courierId') courierId: string,
  ): Promise<Settlement[]> {
    return this.settlementsService.getCourierSettlements(courierId);
  }

  @Get(':id')
  async getSettlementDetails(@Param('id') id: string): Promise<Settlement> {
    return this.settlementsService.getSettlementDetails(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateSettlementDto: UpdateSettlementDto,
  ): Promise<Settlement> {
    return this.settlementsService.updateStatus(id, updateSettlementDto);
  }
}
