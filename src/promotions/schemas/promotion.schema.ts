// src/promotions/schemas/promotion.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Promotion extends Document {
  @Prop({ required: true, unique: true })
  promotionCode: string; // Auto-generated or user-defined code

  @Prop({ required: true })
  discountType: string; // 'percentage' or 'fixed'

  @Prop({ required: true })
  discountValue: number; // Discount value (percentage or fixed amount)

  @Prop({ required: true })
  expirationDate: Date; // Expiration date for the promotion

  @Prop({ required: true, type: [String] })
  eligibleItems: string[]; // Array of eligible product categories or items

  @Prop({ required: true })
  totalUsesAllowed: number; // Total number of allowed uses

  @Prop({ default: 0 })
  totalUsed: number; // Tracks the number of times the promotion has been used

  @Prop({ default: true })
  isActive: boolean; // Determines if the promotion is active or not
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
