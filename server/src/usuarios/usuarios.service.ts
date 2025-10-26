import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsuariosService {

  /* Inyección del modelo de Mongoose para la entidad Usuario */
  constructor(@InjectModel(Usuario.name) private usuarioModel : Model<Usuario> ){}

  create(dtoUsuario: CreateUsuarioDto) {
    const usuario = new this.usuarioModel({
      ...dtoUsuario,
      fecha_nacimiento: new Date(dtoUsuario.fecha_nacimiento)
    })


    const guardar = usuario.save();
    return guardar;
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
