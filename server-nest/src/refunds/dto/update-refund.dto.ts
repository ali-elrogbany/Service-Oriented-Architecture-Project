import { IsNotEmpty, IsEnum } from 'class-validator';

export enum RefundStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class UpdateRefundDto {
  @IsNotEmpty()
  @IsEnum(RefundStatus)
  status: RefundStatus;
}
