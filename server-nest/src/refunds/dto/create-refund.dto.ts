import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateRefundDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
