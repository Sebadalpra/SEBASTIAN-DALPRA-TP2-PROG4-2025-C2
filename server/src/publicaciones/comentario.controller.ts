import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';

@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: PublicacionesService) {}

  @Post()
  create(@Body() createComentario: CreatePublicacionesDto) { 
    return this.comentarioService.createComentario(createComentario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comentarioService.remove(+id);
  }
  
}
