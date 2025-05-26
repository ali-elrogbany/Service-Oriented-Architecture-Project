import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Refund } from './schemas/refund.schema';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';

@Injectable()
export class RefundsService {
  constructor(@InjectModel(Refund.name) private refundModel: Model<Refund>) {}

  async create(createRefundDto: CreateRefundDto): Promise<Refund> {
    const createdRefund = new this.refundModel(createRefundDto);
    return createdRefund.save();
  }

  async findAll(): Promise<Refund[]> {
    return this.refundModel.find().populate('transactionId').exec();
  }

  async updateStatus(
    id: string,
    updateRefundDto: UpdateRefundDto,
  ): Promise<Refund> {
    const updatedRefund = await this.refundModel
      .findByIdAndUpdate(id, updateRefundDto, { new: true })
      .populate('transactionId')
      .exec();

    if (!updatedRefund) {
      throw new NotFoundException(`Refund with ID ${id} not found`);
    }

    return updatedRefund;
  }
}
