import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
