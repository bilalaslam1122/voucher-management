// src/vouchers/schemas/voucher.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Voucher extends Document {
  @Prop({ required: true, unique: true })
  voucherCode: string; // Auto-generated or user-defined code

  @Prop({ required: true })
  discountType: string; // 'percentage' or 'fixed'

  @Prop({ required: true })
  discountValue: number; // Discount value (either percentage or fixed amount)

  @Prop({ required: true })
  expirationDate: Date; // Expiration date for the voucher

  @Prop({ default: null })
  minimumOrderValue?: number; // Optional minimum order value to apply the voucher

  @Prop({ required: true })
  totalUsesAllowed: number; // Total allowed uses

  @Prop({ default: 0 })
  totalUsed: number; // Tracks the number of times the voucher has been used

  @Prop({ default: true })
  isActive: boolean; // Determines if the voucher is active or not
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
