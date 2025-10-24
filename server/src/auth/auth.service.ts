import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    login() {
        // lógica de login
    }

    registro() {
        // lógica de registro
    }

    authJWT() {
        // lógica de autenticación vía JWT
    }

    refrescarToken() {
        // lógica de refresh token
    }
}
