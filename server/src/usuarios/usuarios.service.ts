import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsuariosService {
  /* Inyección del modelo de Mongoose para la entidad Usuario */
  constructor(@InjectModel('Usuario') private usuarioModel: Model<Usuario>) {}

  create(dtoUsuario: CreateUsuarioDto) {
    const usuario = new this.usuarioModel(dtoUsuario);

    const guardar = usuario.save();
    guardar.then((doc) => {
      console.log('Usuario creado:', doc);
    });
    return guardar;
  }

  findAll() {
    return this.usuarioModel.find().exec();
  }

  findOne(username: string) {
    return this.usuarioModel.findOne({ username }).exec();
  }


  async altaBaja(id: string) {
    const usuario = await this.usuarioModel.findById(id);

    if (usuario?.activo) {
      return this.usuarioModel.findByIdAndUpdate(id,
        { activo: false },
        { new: true },
      ).exec();
    } else {
      return this.usuarioModel.findByIdAndUpdate(id,
        { activo: true },
        { new: true },
      ).exec();
    }
  }
}
