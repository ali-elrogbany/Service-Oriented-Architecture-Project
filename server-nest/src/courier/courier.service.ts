import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Courier } from './entities/courier.entity';
import { CreateCourierDto } from './dto/create-courier.dto';

@Injectable()
export class CourierService {
  constructor(
    @InjectModel(Courier.name) private courierModel: Model<Courier>,
  ) {}

  async create(createCourierDto: CreateCourierDto): Promise<Courier> {
    const createdCourier = new this.courierModel(createCourierDto);
    return createdCourier.save();
  }

  async findAll(): Promise<Courier[]> {
    return this.courierModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Courier> {
    const courier = await this.courierModel.findById(id).exec();
    if (!courier) {
      throw new NotFoundException(`Courier with ID ${id} not found`);
    }
    return courier;
  }

  async update(
    id: string,
    updateCourierDto: CreateCourierDto,
  ): Promise<Courier> {
    const updatedCourier = await this.courierModel
      .findByIdAndUpdate(id, updateCourierDto, { new: true })
      .exec();
    if (!updatedCourier) {
      throw new NotFoundException(`Courier with ID ${id} not found`);
    }
    return updatedCourier;
  }

  async remove(id: string): Promise<void> {
    const result = await this.courierModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Courier with ID ${id} not found`);
    }
  }
}
