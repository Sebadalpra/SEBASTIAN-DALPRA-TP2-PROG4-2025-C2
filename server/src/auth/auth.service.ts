import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { sign, decode, verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { CredencialesDto } from './dto/credenciales.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    constructor(private readonly usuariosService: UsuariosService) {}

    async registro(usuario: CreateUsuarioDto) {
        // Hashear la contraseña antes de guardar el usuario
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);
        
        // Crear usuario con la contraseña hasheada
        const usuarioConPasswordHash = {
            ...usuario,
            password: hashedPassword
        };

        const nuevoUsuario = await this.usuariosService.create(usuarioConPasswordHash);

        return this.createToken(nuevoUsuario.username, false);
    }

    async login(credencialesDto: CredencialesDto) {
        const usuario = await this.usuariosService.findOne(credencialesDto.username);

        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        // comparar la contraseña usando bcrypt
        const passwordValida = await bcrypt.compare(credencialesDto.password, usuario.password);
        
        if (!passwordValida) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return this.createToken(credencialesDto.username, false);
    }

    createToken(username: string, isAdmin: boolean) {
        // payload es la data que va a llevar el token
        const payload: { user: string; admin: boolean } = {
            user: username,
            admin: isAdmin,
        };

        // token con la firma, clave secreta y tiempo del token valido
        const token = sign(payload, process.env.JWT_SECRET!, { expiresIn: '2m' });

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


    // ---- manejar tokens con cookies----
    guardarEnCookie(username: string) {
        const tokenData = this.createToken(username, false);
        return tokenData.token;
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

    async LoginCookie(credencialesDto: CredencialesDto) {
        const usuario = await this.usuariosService.findOne(credencialesDto.username);

        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        // si el usuario existe, comparar las contraseñas
        const passwordValida = await bcrypt.compare(credencialesDto.password, usuario.password);
        
        if (!passwordValida) {
            throw new UnauthorizedException('Credenciales inválidas');
        }


        return this.guardarEnCookie(credencialesDto.username);
    }
}
