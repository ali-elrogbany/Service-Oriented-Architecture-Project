import { IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export enum CourierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateCourierDto {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsEnum(CourierStatus)
  @IsOptional()
  status?: CourierStatus = CourierStatus.ACTIVE;

  @IsMongoId()
  userId: Types.ObjectId;
}
