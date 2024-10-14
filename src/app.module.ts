import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VouchersModule } from './vouchers/vouchers.module';
import { PromotionsModule } from './promotions/promotions.module';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://user12:ahYJwftSP0CuMK7r@cluster0.zhkg5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'), // Connect to your MongoDB
    VouchersModule, PromotionsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
