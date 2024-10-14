import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsArray, IsPositive, IsBoolean, ArrayNotEmpty, ArrayUnique,IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @ApiProperty({ description: 'Promotion code (auto-generated or user-defined)' })
  @IsNotEmpty()
  @IsString()
  promotionCode: string;

  @ApiProperty({ description: 'Discount type (must be "percentage" or "fixed")' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['fixed', 'percentage'])  // Enforces that the value must be either 'fixed' or 'percentage'
  discountType: string;

  @ApiProperty({ description: 'The value of the discount (percentage or fixed amount)' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  discountValue: number;

  @ApiProperty({ description: 'Expiration date of the promotion', example: '2024-12-31' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expirationDate: Date;

  @ApiProperty({ description: 'List of eligible items (e.g., product categories or item IDs)' })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  eligibleItems: string[];

  @ApiProperty({ description: 'Total number of uses allowed' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalUsesAllowed: number;

  @ApiProperty({ description: 'Whether the promotion is active or not' })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
