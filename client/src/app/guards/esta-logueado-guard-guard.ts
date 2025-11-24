import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Api } from '../services/api';
import { map, tap } from 'rxjs';

// Permite solo si hay sesión activa, si no redirige a login
export const estaLogueadoGuardGuard: CanActivateFn = (route, state) => {
  const api = inject(Api);
  const router = inject(Router);
  
  return api.getDataConCookie('auth/data/cookie').pipe(
    tap((datos: any) => {
      if (!datos || !datos.rol) {
        router.navigate(['/login']);
      }
    }),
    map((datos: any) => !!datos && !!datos.rol) // devuelve true si hay sesión activa
  );
};
