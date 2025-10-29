import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { CredencialesDto } from './dto/credenciales.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Post de login
  @Post('login')
  Login(@Body() credencialesDto: CredencialesDto) {
    return this.authService.login(credencialesDto);
  }

  // Post de registro
  @Post('registro')
  Registro(@Body() dtoUsuario: CreateUsuarioDto) {
    return this.authService.registro(dtoUsuario);
  }

  // Post de autenticacion via token (JWT)
  AuthJWT() {
    return this.authService.authJWT();
  }

  // Post de refresh token (cada 15 min)
  RefrescarToken() {
    return this.authService.refrescarToken();
  }
}
