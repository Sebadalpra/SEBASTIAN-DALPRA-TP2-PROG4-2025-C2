import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { sign, decode } from 'jsonwebtoken';
import { CredencialesDto } from './dto/credenciales.dto';


@Injectable()
export class AuthService {

    constructor(private readonly usuariosService: UsuariosService) {}

    async registro(dtoUsuario: CreateUsuarioDto) {
        return this.usuariosService.create(dtoUsuario);
    }

    login(credencialesDto: CredencialesDto) {
        // lógica de login
        const payload: any = {
            user: credencialesDto.username,
            admin: false
        };

        const token: string = sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
        return { token : token};
    }
    authJWT() {
        // lógica de autenticación vía JWT
    }

    refrescarToken() {
        // lógica de refresh token
    }
}
