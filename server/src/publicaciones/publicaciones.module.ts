import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { ComentarioController } from './comentario.controller';

@Module({
  controllers: [PublicacionesController, ComentarioController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
