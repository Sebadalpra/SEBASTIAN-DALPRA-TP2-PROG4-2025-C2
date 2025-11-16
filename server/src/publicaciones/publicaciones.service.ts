import { Injectable } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from './entities/publicacione.entity';
import { Model } from 'mongoose';
import { CreateComentarioDto } from './dto/create-comentario.dto';

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

  findOne(id: string) {
    return this.publicacionesModel.findById(id).exec();
  }

  update(id: number, updatePublicacioneDto: UpdatePublicacionesDto) {
    return `This action updates a #${id} publicacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicacione`;
  }

  // metodos relacionados a los comentarios de las publicaciones
  async crearComentario(publicacionId: string, comentarioDto: CreateComentarioDto) {
    return this.publicacionesModel.findByIdAndUpdate(
      publicacionId,
      { $push: { comentarios: comentarioDto} },
      { new: true }
    );
  }

  async addLike(publicacionId: string, username: string) {
    return this.publicacionesModel.findByIdAndUpdate(
      publicacionId,
      { $addToSet: { likes: username } },
      { new: true }
    );
  }

  async removeLike(publicacionId: string, username: string) {
    return this.publicacionesModel.findByIdAndUpdate(
      publicacionId,
      { $pull: { likes: username } },
      { new: true }
    );
  }
}
