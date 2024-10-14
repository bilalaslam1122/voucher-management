import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe,Query } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse,ApiQuery } from '@nestjs/swagger';
import { Voucher } from './schemas/voucher.schema';

@ApiTags('vouchers')
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new voucher' })
  @ApiResponse({ status: 201, description: 'Voucher created successfully.' })
  @ApiBadRequestResponse({ description: 'Error creating voucher' })
  @ApiConflictResponse({ description: 'Voucher code already exists' })  // Documenting conflict error
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.createVoucher(createVoucherDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vouchers with pagination' })
  @ApiResponse({ status: 200, description: 'List of all vouchers.' })
  @ApiBadRequestResponse({ description: 'Error retrieving vouchers' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  async findAll(
    @Query('page') page: number = 1,   // Default to page 1
    @Query('limit') limit: number = 10  // Default to 10 items per page
  ): Promise<Voucher[]> {
    return this.vouchersService.findAll(page, limit);
  }

  @Get(':voucherCode')
  @ApiOperation({ summary: 'Get a voucher by voucherCode' })
  @ApiResponse({ status: 200, description: 'Voucher details.' })
  @ApiNotFoundResponse({ description: 'Voucher not found' })
  async findOne(@Param('voucherCode') voucherCode: string) {
    return this.vouchersService.findOne(voucherCode);
  }

  @Put(':voucherCode')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher updated successfully.' })
  @ApiNotFoundResponse({ description: 'Voucher not found' })
  @ApiBadRequestResponse({ description: 'Error updating voucher' })
  async update(@Param('voucherCode') voucherCode: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.vouchersService.updateVoucher(voucherCode, updateVoucherDto);
  }

  @Delete(':voucherCode')
  @ApiOperation({ summary: 'Delete a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Voucher not found' })
  async delete(@Param('voucherCode') voucherCode: string) {
    // Return the success message from the service
    return this.vouchersService.deleteVoucher(voucherCode);
  }
}
