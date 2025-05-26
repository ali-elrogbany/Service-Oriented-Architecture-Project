import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(['credit', 'debit'])
  type: 'credit' | 'debit';

  @IsString()
  description?: string;
}
