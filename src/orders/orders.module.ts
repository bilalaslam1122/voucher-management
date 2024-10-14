// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Voucher, VoucherSchema } from '../vouchers/schemas/voucher.schema';
import { Promotion, PromotionSchema } from '../promotions/schemas/promotion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Voucher.name, schema: VoucherSchema }, // To link voucher to order
      { name: Promotion.name, schema: PromotionSchema }, // To link promotion to order
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
