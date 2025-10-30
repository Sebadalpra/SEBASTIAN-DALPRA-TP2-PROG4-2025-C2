import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('foto', {
    storage: diskStorage({
      destination: './public/images',
      filename: (req, file, cb) => {
        const nombreArchivo = `${Date.now()}-${file.originalname}`;
        cb(null, nombreArchivo);
      }
    })
  }))
  subirArchivo(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { message: 'la foto se subió correctamente', file };
  }

}
