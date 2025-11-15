import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';

@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: PublicacionesService) {}

  @Post(':publicacionId')
  create(@Param('publicacionId') publicacionId: string, @Body() createComentario: CreateComentarioDto) { 
    return this.comentarioService.crearComentario(publicacionId, createComentario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comentarioService.remove(+id);
  }
  
}
