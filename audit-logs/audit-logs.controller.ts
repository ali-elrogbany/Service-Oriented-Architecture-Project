import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './schemas/audit-log.schema';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  async create(
    @Body() createAuditLogDto: CreateAuditLogDto,
  ): Promise<AuditLog> {
    return this.auditLogsService.create(createAuditLogDto);
  }

  @Get()
  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<AuditLog[]> {
    return this.auditLogsService.findByUserId(userId);
  }

  @Get('action/:action')
  async findByAction(@Param('action') action: string): Promise<AuditLog[]> {
    return this.auditLogsService.findByAction(action);
  }
}
