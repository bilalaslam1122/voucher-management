import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher } from './schemas/voucher.schema';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(@InjectModel(Voucher.name) private voucherModel: Model<Voucher>) {}

  async createVoucher(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    try {
      const newVoucher = new this.voucherModel(createVoucherDto);
      return await newVoucher.save();
    } catch (error) {
      // Check if the error is a duplicate key error (MongoDB error code 11000)
      if (error.code === 11000) {
        throw new BadRequestException(`Voucher code "${createVoucherDto.voucherCode}" already exists`);
      }
      // For other errors, return a generic error message
      throw new BadRequestException('Error creating voucher');
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Voucher[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.voucherModel
        .find()
        .skip(skip)  // Skip the documents to paginate
        .limit(limit)  // Limit the number of documents returned
        .exec();
    } catch (error) {
      throw new BadRequestException('Error retrieving vouchers');
    }
  }
  

  async findOne(voucherCode: string): Promise<Voucher> {
    const voucher = await this.voucherModel.findOne({ voucherCode }).exec();
    if (!voucher) {
      throw new NotFoundException(`Voucher with code ${voucherCode} not found`);
    }
    return voucher;
  }

  async updateVoucher(voucherCode: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher> {
    const updatedVoucher = await this.voucherModel.findOneAndUpdate(
      { voucherCode },
      updateVoucherDto,
      { new: true }
    ).exec();
    
    if (!updatedVoucher) {
      throw new NotFoundException(`Voucher with code ${voucherCode} not found`);
    }

    return updatedVoucher;
  }

  async deleteVoucher(voucherCode: string): Promise<{ message: string }> {
    const result = await this.voucherModel.deleteOne({ voucherCode }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Voucher with code ${voucherCode} not found`);
    }

    // Return success message if the voucher was deleted
    return { message: `Voucher with code ${voucherCode} deleted successfully` };
  }
}
