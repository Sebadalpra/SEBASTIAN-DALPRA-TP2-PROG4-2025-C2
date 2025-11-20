import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { Publicaciones, PublicacionesSchema } from './entities/publicacione.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Publicaciones', schema: PublicacionesSchema }
    ])
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
