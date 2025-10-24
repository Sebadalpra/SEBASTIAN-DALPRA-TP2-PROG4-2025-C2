import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  create(@Body() dtoCrearPublicaciones: CreatePublicacionesDto) {
    return this.publicacionesService.create(dtoCrearPublicaciones);
  }

  @Get()
  findAll() {
    return this.publicacionesService.findAll()
  }

  @Get(':id') // por uuario para traer las 3 publicaciones del perfil
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionesService.remove(+id);
  }





}
