import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import setupSwagger from './config/swagger';
import { corsOptions } from './config/cors';
import { HttpExceptionFilter } from './config/exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe())
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
