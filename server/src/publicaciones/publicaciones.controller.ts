import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './public/images',
      // guardado:
      filename: (req, file, cb) => {
        const nombreArchivo = Date.now() + '-' + file.originalname;
        cb(null, nombreArchivo);
      }
    })
  }))
  // con formdata los campos de @body no funcionan como todo un objeto, por eso van uno por uno
  create(@Body('titulo') titulo: string, @Body('mensaje') mensaje: string, @UploadedFile() file: Express.Multer.File) {
    const publicacionConImagen = {
      titulo,
      mensaje,
      imagen: file ? file.filename : ''
    };
    return this.publicacionesService.create(publicacionConImagen);
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
