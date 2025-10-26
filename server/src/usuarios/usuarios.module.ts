import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './entities/usuario.entity';

@Module({
  imports: [
    // establecer la conexion con mongo y el schema de usuario
    MongooseModule.forFeature([{name: 'Usuario', schema: UsuarioSchema}]) // -> name: es el nombre para inyectar en otro modulo
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
