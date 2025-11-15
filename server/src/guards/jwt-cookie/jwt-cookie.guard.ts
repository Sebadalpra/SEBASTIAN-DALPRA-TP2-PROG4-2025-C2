import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class JwtCookieGuard implements CanActivate {lee
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = request.cookies['token'] as string;

    if (token && token !== ' ') {
      try {
        // Verificar el token usando la clave secreta
        const payload = verify(token, process.env.JWT_SECRET!);
        (request as any).user = payload; // esto permite acceder al payload en los controladores
        // Si la verificación es exitosa, permitir el acceso
        return true;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new HttpException('Token expirado', 401);
        }
      }
    }
    return false;
    
  }
}
