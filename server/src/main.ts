
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // cors para conectar el 4200 con el 3000
  app.enableCors();

  // archivos estáticos desde la carpeta public/images
  app.use('/public/images', express.static(join(__dirname, '..', 'public/images')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
