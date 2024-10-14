import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDate, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVoucherDto {
  @ApiProperty({ description: 'Voucher code (auto-generated or user-defined)' })
  @IsNotEmpty()
  @IsString()
  voucherCode: string;

  @ApiProperty({ description: 'Discount type (e.g., percentage or fixed amount)' })
  @IsNotEmpty()
  @IsString()
  discountType: string;

  @ApiProperty({ description: 'The value of the discount (percentage or fixed amount)' })
  @IsNotEmpty()
  @IsNumber()
  discountValue: number;

  @ApiProperty({ description: 'Expiration date of the voucher', example: '2024-12-31' })
  @IsNotEmpty()
  @Type(() => Date)  // Converts incoming string to a Date object
  @IsDate()          // Ensures the field is a valid Date
  expirationDate: Date;


  @ApiProperty({ description: 'Minimum order value to apply the voucher', required: false })
  @IsOptional()
  @IsNumber()
  minimumOrderValue?: number;

  @ApiProperty({ description: 'Total number of uses allowed' })
  @IsNotEmpty()
  @IsNumber()
  totalUsesAllowed: number;
}
