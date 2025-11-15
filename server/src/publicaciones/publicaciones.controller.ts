import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { multerConfig } from 'src/config/multer.config';
import { verify } from 'jsonwebtoken';
import { CreateComentarioDto } from './dto/create-comentario.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
  create(
    @Body('titulo') titulo: string,
    @Body('mensaje') mensaje: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {

    // leer el token de la cookie
    const token = req.cookies?.token;
    if (!token) {
      throw new UnauthorizedException('No autenticado');
    }
    
    // ----------
    let username = '';
    try {
        const payload: any = verify(token, process.env.JWT_SECRET!); // verify es para verificar y decodificar el token
        username = payload.user;
    } catch (e) {
        throw new UnauthorizedException('Token inválido');
    }
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
  async like(@Param('id') id: string, @Req() req: any) {
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException('No autenticado');
    let username = '';
    try {
      const payload: any = verify(token, process.env.JWT_SECRET!);
      username = payload.user;
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
    return this.publicacionesService.addLike(id, username);
  }

  @Post(':id/unlike')
  async unlike(@Param('id') id: string, @Req() req: any) {
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException('No autenticado');
    let username = '';
    try {
      const payload: any = verify(token, process.env.JWT_SECRET!);
      username = payload.user;
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
    return this.publicacionesService.removeLike(id, username);
  }

  @Post(':id/comentarios')
  async comentar(@Param('id') id: string, @Body() comentarioDto: CreateComentarioDto, @Req() req: any) {
    console.log('comentario recibido:', comentarioDto);

    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException('No autenticado');
    let username = '';
    try {
      const payload: any = verify(token, process.env.JWT_SECRET!);
      username = payload.user;
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
    // usar el usarname obtenido desde el token y en el dto q sea campo opcional
    comentarioDto.username = username;
    return this.publicacionesService.crearComentario(id, comentarioDto);
  }





}
