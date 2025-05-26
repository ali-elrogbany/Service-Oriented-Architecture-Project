import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum SettlementStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class UpdateSettlementDto {
  @IsNotEmpty()
  @IsEnum(SettlementStatus)
  status: SettlementStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
