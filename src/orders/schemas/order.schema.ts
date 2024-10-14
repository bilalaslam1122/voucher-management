// src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Voucher } from '../../vouchers/schemas/voucher.schema';
import { Promotion } from '../../promotions/schemas/promotion.schema';

@Schema()
export class Order extends Document {
  @Prop({ required: true, type: [String] })
  items: string[]; // Array of product/item IDs in the order

  @Prop({ required: true })
  totalOrderValue: number; // Total value of the order

  // Voucher applied to the order (using ObjectId reference)
  @Prop({ type: Types.ObjectId, ref: 'Voucher', default: null })
  voucherApplied?: Voucher; // Applied voucher (if any)

  // Promotion applied to the order (using ObjectId reference)
  @Prop({ type: Types.ObjectId, ref: 'Promotion', default: null })
  promotionApplied?: Promotion; // Applied promotion (if any)

  @Prop({ default: 0 })
  discountValue: number; // Discount applied based on voucher/promotion

  @Prop({ required: true })
  finalOrderValue: number; // Final total after applying discount

  @Prop({ default: Date.now })
  orderDate: Date; // Date of the order
}

export const OrderSchema = SchemaFactory.createForClass(Order);
