import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsuariosModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
