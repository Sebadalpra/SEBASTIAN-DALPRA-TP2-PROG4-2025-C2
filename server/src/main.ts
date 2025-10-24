import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors para conectar el 4200 con el 3000
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
