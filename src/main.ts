import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Для того, чтоб в body были только нужные поля
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
