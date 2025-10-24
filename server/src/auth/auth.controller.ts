import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Post de login
  @Post('login')
  Login() {
    return this.authService.login();
  }

  // Post de registro
  @Post('registro')
  Registro() {
    return this.authService.registro();
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
