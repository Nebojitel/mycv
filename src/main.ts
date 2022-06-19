import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['asdasdasd'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // Для того, чтоб в body были только нужные поля
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
