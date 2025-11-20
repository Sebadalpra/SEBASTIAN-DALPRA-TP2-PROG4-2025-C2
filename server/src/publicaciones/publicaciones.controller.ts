import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { multerConfig } from 'src/config/multer.config';
import { verify } from 'jsonwebtoken';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { JwtCookieGuard } from 'src/guards/jwt-cookie/jwt-cookie.guard';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
  @UseGuards(JwtCookieGuard)
  create(
    @Body('titulo') titulo: string,
    @Body('mensaje') mensaje: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    
    // ----------
    let username = (req as any).user.user; // obtener el nombre de usuario del payload del token

    const publicacionConImagen = {
      titulo,
      mensaje,
      imagen: file ? file.filename : '',
      username
    };
    
    return this.publicacionesService.create(publicacionConImagen);
  }

  @Get()
  findAll() {
    return this.publicacionesService.findAll()
  }

  @Get(':id') // por usuario para traer una publicación por id
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionesService.remove(+id);
  }

  @Post(':id/like')
  // usar directamente yun guard en vez de verificar la cookie manualmente
  @UseGuards(JwtCookieGuard) 

  async like(@Param('id') id: string, @Req() req: any) {
    const username = (req as any).user.user;
    return this.publicacionesService.addLike(id, username);
  }

  @Post(':id/unlike')
  @UseGuards(JwtCookieGuard)

  async unlike(@Param('id') id: string, @Req() req: any) {
    const username = (req as any).user.user;
    return this.publicacionesService.removeLike(id, username);
  }

  @Post(':id/comentarios')
  @UseGuards(JwtCookieGuard)
  async comentar(@Param('id') id: string, @Body() comentarioDto: CreateComentarioDto, @Req() req: any) {
    const username = (req as any).user.user;
    comentarioDto.username = username;
    return this.publicacionesService.crearComentario(id, comentarioDto);
  }





}
