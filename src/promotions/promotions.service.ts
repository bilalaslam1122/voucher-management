import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion } from './schemas/promotion.schema';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(@InjectModel(Promotion.name) private promotionModel: Model<Promotion>) {}

  async createPromotion(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    try {
      const newPromotion = new this.promotionModel(createPromotionDto);
      return await newPromotion.save();
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error for unique promotionCode
        throw new ConflictException(`Promotion code "${createPromotionDto.promotionCode}" already exists`);
      } else if (error.name === 'ValidationError') {
        // Mongoose validation error
        throw new BadRequestException('Invalid data provided');
      } else {
        throw new InternalServerErrorException('Unexpected error creating promotion');
      }
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Promotion[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.promotionModel
        .find()
        .skip(skip)  // Skip the documents to paginate
        .limit(limit)  // Limit the number of documents returned
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving promotions');
    }
  }
  

  async findOne(promotionCode: string): Promise<Promotion> {
    try {
      const promotion = await this.promotionModel.findOne({ promotionCode }).exec();
      if (!promotion) {
        throw new NotFoundException(`Promotion with code ${promotionCode} not found`);
      }
      return promotion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error retrieving promotion');
    }
  }

  async updatePromotion(promotionCode: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    try {
      const updatedPromotion = await this.promotionModel.findOneAndUpdate(
        { promotionCode },
        updatePromotionDto,
        { new: true }
      ).exec();

      if (!updatedPromotion) {
        throw new NotFoundException(`Promotion with code ${promotionCode} not found`);
      }

      return updatedPromotion;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid data provided for update');
      } else if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error updating promotion');
    }
  }

  async deletePromotion(promotionCode: string): Promise<{ message: string }> {
    try {
      const result = await this.promotionModel.deleteOne({ promotionCode }).exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException(`Promotion with code ${promotionCode} not found`);
      }

      return { message: `Promotion with code ${promotionCode} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error deleting promotion');
    }
  }
}
