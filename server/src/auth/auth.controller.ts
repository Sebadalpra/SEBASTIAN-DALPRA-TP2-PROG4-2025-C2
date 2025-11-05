import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { CredencialesDto } from './dto/credenciales.dto';
import type { response, Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  Registro(@Body() dtoUsuario: CreateUsuarioDto) {
    return this.authService.registro(dtoUsuario);
  }

  @Post('login')
  Login(@Body() credencialesDto: CredencialesDto) {
    return this.authService.login(credencialesDto);
  }


  @Get('data')
  traer(@Headers("Authorization") authHeader: string) {
    return this.authService.verificar(authHeader);
  }

  @Post('login/cookie')
  LoginCookie(@Body() credencialesDto: CredencialesDto, @Res() response: Response) {
    const token = this.authService.LoginCookie(credencialesDto);
    response.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict', 
      //secure: false , // en desarrollo (http) en producción debe cambiar a true (https)
      expires: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
    }); 
    response.json({ message: "Logueado con cookie" });

  }

  @Get('data/cookie')
  traerCookie(@Req() request: Request) {
    const token = request.cookies["token"] as string;
    return this.authService.verificarCookie(token);
  }
}
