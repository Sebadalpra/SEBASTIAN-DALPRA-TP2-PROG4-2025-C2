import { CanActivateFn } from '@angular/router';

export const estaLogueadoGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
