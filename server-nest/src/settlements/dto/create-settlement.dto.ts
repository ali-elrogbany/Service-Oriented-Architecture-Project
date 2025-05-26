import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  MOBILE_WALLET = 'MOBILE_WALLET',
}

export class CreateSettlementDto {
  @IsNotEmpty()
  @IsString()
  courierId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  periodStart: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  periodEnd: Date;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  @IsObject()
  paymentDetails: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
