import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

const swaggerConfig = (): Omit<OpenAPIObject, 'paths'> =>
  new DocumentBuilder()
  .setTitle('Auto Check Est Swagger')
  .setDescription('The Auto Check Est API description')
  .setVersion('0.1')
  .build();

const setupSwagger = (app: INestApplication) =>
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerConfig()));

export default setupSwagger;
