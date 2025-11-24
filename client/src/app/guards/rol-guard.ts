import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Api } from '../services/api';
import { map, tap } from 'rxjs';

// Permite solo si el usuario es admin, si no redirige a /error
export const rolGuard: CanActivateFn = (route, state) => {
  const api = inject(Api);
  const router = inject(Router);
  return api.getDataConCookie('auth/data/cookie').pipe(
    tap((datos: any) => {
      if (datos.rol !== 'admin') {
        router.navigate(['/error']);
      }
    }),
    map((datos: any) => datos.rol === 'admin') // devuelve true si el rol es admin
  );
};
