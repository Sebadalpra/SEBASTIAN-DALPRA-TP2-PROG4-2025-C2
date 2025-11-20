import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class JwtCookieGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = request.cookies['token'] as string;

    if (token && token !== ' ') {
      try {
        // verificar el token usando la clave secreta
        const payload = verify(token, process.env.JWT_SECRET!);
        (request as any).user = payload; // esto permite acceder al payload en los controladores
        console.log('✅ Guard: Token válido para usuario:', (payload as any).user);
        // si la verificación es exitosa, obtener el payload y permitir el acceso
        return true;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          console.log("El token expiro")
          throw new HttpException({ message: 'Token expirado' }, 401);
        }
        console.log("Token inválido");
        throw new HttpException({ message: 'Token inválido' }, 401);
      }
    }
    console.log("No hay token o usuario no inicio sesión");
    throw new HttpException({ message: 'No autenticado' }, 401);
    
  }
}
