import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
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

  @Get('data')
  traer(@Headers("Authorization") authHeader: string) {
    return this.authService.verificar(authHeader);
  }


}
