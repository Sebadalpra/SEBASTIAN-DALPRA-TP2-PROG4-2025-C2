
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

  // cors para conectar el frontend con el backend y permitir cookies
  app.enableCors({
    origin: ['http://localhost:4200', 'https://sebastian-dalpra-tp-2-prog-4-2025-c-taupe.vercel.app/'], // Reemplazá con tu URL de Vercel
    credentials: true, // permite enviar y recibir cookies
  });

  // archivos estáticos desde la carpeta public/images
  app.use('/public/images', express.static(join(__dirname, '..', 'public/images')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
