import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { ComentarioController } from './comentario.controller';
import { Publicaciones, PublicacionesSchema } from './entities/publicacione.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Publicaciones', schema: PublicacionesSchema }
    ])
  ],
  controllers: [PublicacionesController, ComentarioController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
