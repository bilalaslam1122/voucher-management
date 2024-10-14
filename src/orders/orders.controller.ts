import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('orders')  // Tags this controller in Swagger UI
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new order and apply voucher/promotion' })  // Operation summary in Swagger UI
  @ApiResponse({ status: 201, description: 'Order created successfully' })  // 201 status description
  @ApiBadRequestResponse({ description: 'Invalid voucher or promotion' })  // Bad request description for invalid input
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }
}
