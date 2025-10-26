import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // cors para conectar el 4200 con el 3000
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
