import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CourierService } from './courier.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { Courier } from './entities/courier.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Controller('couriers')
export class CourierController {
  constructor(
    private readonly courierService: CourierService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourierDto: CreateCourierDto): Promise<Courier> {
    const courier = await this.courierService.create(createCourierDto);
    await this.auditLogsService.create({
      action: 'Courier Created',
      user_id: createCourierDto.userId.toString(),
    });
    return courier;
  }

  @Get()
  findAll(): Promise<Courier[]> {
    return this.courierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Courier> {
    return this.courierService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourierDto: CreateCourierDto,
  ): Promise<Courier> {
    const courier = await this.courierService.update(id, updateCourierDto);
    await this.auditLogsService.create({
      action: 'Courier Updated',
      user_id: updateCourierDto.userId.toString(),
    });
    return courier;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Body() { userId }: { userId: string },
  ): Promise<void> {
    await this.courierService.remove(id);
    await this.auditLogsService.create({
      action: 'Courier Deleted',
      user_id: userId,
    });
  }
}
