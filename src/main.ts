import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/swagger-static', express.static(join(__dirname, '..', 'node_modules', 'swagger-ui-dist')));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Voucher & Promotion Management API')
    .setDescription('API for managing vouchers, promotions, and applying them to orders')
    .setVersion('1.0')
    .addTag('vouchers')
    .addTag('promotions')
    .addTag('orders')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Swagger is running on: http://localhost:3000/api`);
}
bootstrap();
