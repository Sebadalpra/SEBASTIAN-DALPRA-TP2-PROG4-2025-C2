import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from './entities/publicacione.entity';
import { Model } from 'mongoose';
import { CreateComentarioDto } from './dto/create-comentario.dto';

@Injectable()
export class PublicacionesService {

  // model me trae los metodos para interactuar con la coleccion de publicaciones (es la entity)
  constructor(@InjectModel('Publicaciones') private publicacionesModel : Model<Publicaciones> ){}

  create(nuevaPubli: CreatePublicacionesDto) {
    const nuevaPublicacion = new this.publicacionesModel(nuevaPubli);
    return nuevaPublicacion.save();
  }

  findAll() {
    console.log("Buscando todas las publicaciones activas")
    // Solo traer publicaciones activas
    return this.publicacionesModel.find({ activa: true }).exec();
  }

  findOne(id: string) {
    return this.publicacionesModel.findById(id).exec();
  }

  update(id: number, updatePublicacioneDto: UpdatePublicacionesDto) {
    return `This action updates a #${id} publicacione`;
  }

  async remove(id: string, username: string) {
    // 1. Buscar la publicación
    const publicacion = await this.publicacionesModel.findById(id);
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // 2. Verificar que el usuario sea el dueño de la publicación
    if (username !== publicacion.username) {
      throw new ForbiddenException('No tenés permisos para eliminar esta publicación');
    }

    // 3. Eliminar la publicación
    return this.publicacionesModel.findByIdAndDelete(id);
  }

  // Dar de baja una publicación (solo admin)
  async darDeBaja(id: string, rolUsuario: string) {
    // 1. Verificar que sea admin
    if (rolUsuario != 'admin') {
      throw new ForbiddenException('Solo los admin pueden dar de baja una publicación');
    }

    // 2. Buscar la publicación
    const publicacion = await this.publicacionesModel.findById(id);
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }
    else if (!publicacion.activa) {
      throw new BadRequestException('La publicación ya está dada de baja');
    }
    

    // 3. Marcar como inactiva
    return this.publicacionesModel.findByIdAndUpdate(id,{ activa: false },{ new: true });
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

  // editar comentario (solo el dueño puede editarlo)
  async editarComentario(publicacionId: string, comentarioId: string, nuevoTexto: string, username: string) {
    // 1. buscar la publicación
    const publicacion = await this.publicacionesModel.findById(publicacionId);
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // 2. buscar el comentario específico por su ID
    const comentario = publicacion.comentarios.find(
      (c: any) => c._id.toString() === comentarioId
    );
    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // 3. verificar que el usuario sea el dueño del comentario
    if (username !== comentario.username) {
      throw new ForbiddenException('No tenés permisos para editar este comentario');
    }

    // 4. actualizar el comentario en mongo
    return this.publicacionesModel.findOneAndUpdate(
      { _id: publicacionId, 'comentarios._id': comentarioId },
      { 
        $set: { 
          'comentarios.$.texto': nuevoTexto,
          'comentarios.$.modificado': true 
        }
      },
      { new: true }
    );
  }

}