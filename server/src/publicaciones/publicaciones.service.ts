import { Injectable } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from './entities/publicacione.entity';
import { Model } from 'mongoose';

@Injectable()
export class PublicacionesService {

  // model me trae los metodos para interactuar con la coleccion de publicaciones
  constructor(@InjectModel('Publicaciones') private publicacionesModel : Model<Publicaciones> ){}

  create(nuevaPubli: CreatePublicacionesDto) {
    const nuevaPublicacion = new this.publicacionesModel(nuevaPubli);
    return nuevaPublicacion.save();
  }

  findAll() {
    console.log("Buscando todas las publicaciones")
    return this.publicacionesModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacione`;
  }

  update(id: number, updatePublicacioneDto: UpdatePublicacionesDto) {
    return `This action updates a #${id} publicacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicacione`;
  }

  // metodos relacionados a los comentarios de las publicaciones
  
  createComentario(createComentarioDto: CreatePublicacionesDto) {
    return 'NUEVO COMENTARIO';
  }
}
