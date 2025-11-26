import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { JwtCookieGuard } from '../guards/jwt-cookie/jwt-cookie.guard';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  @UseGuards(JwtCookieGuard)
  async publicacionesPorUsuario(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.estadisticasService.getPublicacionesPorUsuario(fechaInicio, fechaFin);
  }

  @Get('comentarios-totales')
  @UseGuards(JwtCookieGuard)
  async comentariosTotales(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.estadisticasService.getComentariosTotales(fechaInicio, fechaFin);
  }

  @Get('comentarios-por-publicacion')
  @UseGuards(JwtCookieGuard)
  async comentariosPorPublicacion(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.estadisticasService.getComentariosPorPublicacion(fechaInicio, fechaFin);
  }
}
