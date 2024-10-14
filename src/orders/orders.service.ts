import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Voucher } from '../vouchers/schemas/voucher.schema';
import { Promotion } from '../promotions/schemas/promotion.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Voucher.name) private voucherModel: Model<Voucher>,
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    let discountValue = 0;
    let finalOrderValue = createOrderDto.totalOrderValue;

    // Enforce maximum discount limit (50% of the total order value)
    const MAX_DISCOUNT_PERCENTAGE = 0.5;

    // Check if a voucher is applied and is valid
    if (createOrderDto.voucherApplied) {
      const voucher = await this.voucherModel.findById(createOrderDto.voucherApplied).exec();
      if (!voucher) {
        throw new NotFoundException('Voucher not found');
      }
      if (!this.isVoucherValid(voucher, createOrderDto.totalOrderValue)) {
        throw new BadRequestException('Invalid or expired voucher');
      }

      discountValue += this.calculateDiscount(voucher.discountType, voucher.discountValue, createOrderDto.totalOrderValue);
      
      // Ensure the voucher is not used more than once in the same order and check usage limit
      if (voucher.totalUsed >= voucher.totalUsesAllowed) {
        throw new BadRequestException('Voucher usage limit exceeded');
      }
      
      // Increment voucher usage count
      voucher.totalUsed += 1;
      await voucher.save();
    }

    // Check if a promotion is applied and is valid
    if (createOrderDto.promotionApplied) {
      const promotion = await this.promotionModel.findById(createOrderDto.promotionApplied).exec();
      if (!promotion) {
        throw new NotFoundException('Promotion not found');
      }
      if (!this.isPromotionValid(promotion, createOrderDto.items)) {
        throw new BadRequestException('Invalid or expired promotion');
      }

      discountValue += this.calculateDiscount(promotion.discountType, promotion.discountValue, createOrderDto.totalOrderValue);
      
      // Ensure the promotion is not used more than once in the same order and check usage limit
      if (promotion.totalUsed >= promotion.totalUsesAllowed) {
        throw new BadRequestException('Promotion usage limit exceeded');
      }
      
      // Increment promotion usage count
      promotion.totalUsed += 1;
      await promotion.save();
    }

    // Enforce the maximum discount rule (e.g., no more than 50% off)
    const maxAllowedDiscount = createOrderDto.totalOrderValue * MAX_DISCOUNT_PERCENTAGE;
    if (discountValue > maxAllowedDiscount) {
      discountValue = maxAllowedDiscount;
    }

    // Calculate final order value after applying discount
    finalOrderValue = createOrderDto.totalOrderValue - discountValue;

    const newOrder = new this.orderModel({
      ...createOrderDto,
      discountValue,
      finalOrderValue,
    });

    return await newOrder.save();
  }

  private isVoucherValid(voucher: Voucher, totalOrderValue: number): boolean {
    if (!voucher.isActive || voucher.expirationDate < new Date()) {
      return false;
    }
    if (voucher.totalUsed >= voucher.totalUsesAllowed) {
      return false;
    }
    if (voucher.minimumOrderValue && totalOrderValue < voucher.minimumOrderValue) {
      return false;
    }
    return true;
  }

  private isPromotionValid(promotion: Promotion, items: string[]): boolean {
    if (!promotion.isActive || promotion.expirationDate < new Date()) {
      return false;
    }
    if (promotion.totalUsed >= promotion.totalUsesAllowed) {
      return false;
    }
    // Check if the promotion applies to the eligible items
    const applicableItems = promotion.eligibleItems;
    return items.some(item => applicableItems.includes(item));
  }

  private calculateDiscount(discountType: string, discountValue: number, totalOrderValue: number): number {
    if (discountType === 'percentage') {
      return (discountValue / 100) * totalOrderValue;
    } else {
      return discountValue;
    }
  }
}
