import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { sign, decode, verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { CredencialesDto } from './dto/credenciales.dto';


@Injectable()
export class AuthService {

    constructor(private readonly usuariosService: UsuariosService) {}

    async registro(dtoUsuario: CreateUsuarioDto) {
        const nuevoUsuario = await this.usuariosService.create(dtoUsuario);

        return this.createToken(nuevoUsuario.username, false);
    }

    async login(credencialesDto: CredencialesDto) {
        const usuario = await this.usuariosService.findOne(credencialesDto.username);

        return this.createToken(credencialesDto.username, false);
    }

    createToken(username: string, isAdmin: boolean) {
        // payload es la data que va a llevar el token
        const payload: { user: string; admin: boolean } = {
            user: username,
            admin: isAdmin
        };

        const token = sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });

        return { token : token};
    }

    // verificar devuelve el payload del token si es válido
    verificar(authHeader: string) {
        console.log(authHeader);
        if (!authHeader) throw new BadRequestException('no hay encabezado de autorización');

        const [tipo, token] = authHeader.split(' ');

        if( tipo !== 'Bearer' || !token) throw new BadRequestException('encabezado de autorización invalido');

        try {
            const tokenValidado = verify(token, process.env.JWT_SECRET!);
            return tokenValidado;

        }
        catch (error) {
            if (error instanceof TokenExpiredError) {
                return "Token expirado";
            } 
            if (error instanceof JsonWebTokenError) {
                return "Firma falsa o token manipulado";
            }
            return "Error en la verificación del token";
        }


    }


    // manejar tokens con cookies
    guardarEnCookie(username: string) {
        const token = this.createToken(username, false);
    }

    verificarCookie(token: string) {

        try {
            const tokenValidado = verify(token, process.env.JWT_SECRET!);
            return tokenValidado;

        }
        catch (error) {
            if (error instanceof TokenExpiredError) {
                return "Token expirado";
            } 
            if (error instanceof JsonWebTokenError) {
                return "Firma falsa o token manipulado";
            }
            return "Error en la verificación del token";
        }

    }

    LoginCookie(user: CredencialesDto) {
        return this.guardarEnCookie(user.username);
    }
}
