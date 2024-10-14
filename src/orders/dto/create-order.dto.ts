import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray, IsOptional, IsMongoId, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Array of product/item IDs in the order', example: ['product1', 'product2'] })
  @IsNotEmpty()
  @IsArray()
  items: string[];

  @ApiProperty({ description: 'Total value of the order before discounts', example: 100.50 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalOrderValue: number;

  @ApiProperty({ description: 'Voucher ID applied to the order (optional)', required: false, example: '605c72ef5564a24e5ce1224d' })
  @IsOptional()
  @IsMongoId({ message: 'The provided voucher ID is not valid' })  // Custom error message for voucher
  voucherApplied?: string;

  @ApiProperty({ description: 'Promotion ID applied to the order (optional)', required: false, example: '605c72ef5564a24e5ce1224d' })
  @IsOptional()
  @IsMongoId({ message: 'The provided promotion ID is not valid' })  // Custom error message for promotion
  promotionApplied?: string;
}
