import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe,Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse, ApiInternalServerErrorResponse,ApiQuery } from '@nestjs/swagger';
import { Promotion } from './schemas/promotion.schema';
@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))  // Ensures that only expected fields are accepted
  @ApiOperation({ summary: 'Create a new promotion' })
  @ApiResponse({ status: 201, description: 'Promotion created successfully.' })
  @ApiConflictResponse({ description: 'Promotion code already exists' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error creating promotion' })
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.createPromotion(createPromotionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all promotions with pagination' })
  @ApiResponse({ status: 200, description: 'List of all promotions.' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error retrieving promotions' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  async findAll(
    @Query('page') page: number = 1,   // Default to page 1
    @Query('limit') limit: number = 10  // Default to 10 items per page
  ) {
    return this.promotionsService.findAll(page, limit);
  }

  @Get(':promotionCode')
  @ApiOperation({ summary: 'Get a promotion by promotionCode' })
  @ApiResponse({ status: 200, description: 'Promotion details.' })
  @ApiNotFoundResponse({ description: 'Promotion not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error retrieving promotion' })
  async findOne(@Param('promotionCode') promotionCode: string) {
    return this.promotionsService.findOne(promotionCode);
  }

  @Put(':promotionCode')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a promotion' })
  @ApiResponse({ status: 200, description: 'Promotion updated successfully.' })
  @ApiNotFoundResponse({ description: 'Promotion not found' })
  @ApiBadRequestResponse({ description: 'Invalid data provided for update' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error updating promotion' })
  async update(@Param('promotionCode') promotionCode: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsService.updatePromotion(promotionCode, updatePromotionDto);
  }

  @Delete(':promotionCode')
  @ApiOperation({ summary: 'Delete a promotion' })
  @ApiResponse({ status: 200, description: 'Promotion deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Promotion not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error deleting promotion' })
  async delete(@Param('promotionCode') promotionCode: string) {
    return this.promotionsService.deletePromotion(promotionCode);
  }
}
