import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { Publicaciones, PublicacionesSchema } from '../publicaciones/entities/publicacione.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Publicaciones', schema: PublicacionesSchema }
    ])
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
