import { Body, Controller, Get, Headers, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { CredencialesDto } from './dto/credenciales.dto';
import type { response, Response, Request } from 'express';
import { JwtCookieGuard } from 'src/guards/jwt-cookie/jwt-cookie.guard';
import { decode } from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('fotoPerfil', multerConfig))
  Registro(
    // al ser formdata, cada campo va por separado
    @Body('nombre') nombre: string,
    @Body('apellido') apellido: string,
    @Body('email') email: string,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('fecha_nacimiento') fecha_nacimiento: string,
    @Body('descripcion') descripcion: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const usuarioConFoto = {
      nombre,
      apellido,
      email,
      username,
      password,
      fecha_nacimiento,
      descripcion,
      fotoPerfil: file ? file.filename : ''
    };
    return this.authService.registro(usuarioConFoto);
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
  async LoginCookie(@Body() credencialesDto: CredencialesDto, @Res() response: Response) {
    const token = await this.authService.LoginCookie(credencialesDto);
    response.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none', // cambiar a 'none' para producción
      secure: true, // cambiar a true para producción
      expires: new Date(Date.now() + 2 * 60 * 1000)
    }); 
    response.json({ message: "Logueado con cookie" });

  }

  @Get('data/cookie')
  @UseGuards(JwtCookieGuard)
  traerCookie(@Req() request: Request) {
    const token = request.cookies["token"] as string;
    return this.authService.verificarCookie(token);
  }

  @Post('refresh/cookie')
  @UseGuards(JwtCookieGuard)
  async refreshCookie(@Req() request: Request, @Res() response: Response) {
    const user = (request as any).user;
    const nuevoToken = this.authService.guardarEnCookie(user.user);
    
    response.cookie('token', nuevoToken, {
      httpOnly: true,
      sameSite: 'none', // cambiar a 'none' para producción
      secure: true, // cambiar a true para producción
      expires: new Date(Date.now() + 2 * 60 * 1000)
    });
    
    response.json({ message: 'Token refrescado' });
  }
}
