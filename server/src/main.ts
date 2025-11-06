
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // cors para conectar el 4200 con el 3000 y permitir cookies
  app.enableCors({
    origin: true, 
    credentials: true, // permite enviar y recibir cookies
  });

  // archivos estáticos desde la carpeta public/images
  app.use('/public/images', express.static(join(__dirname, '..', 'public/images')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
