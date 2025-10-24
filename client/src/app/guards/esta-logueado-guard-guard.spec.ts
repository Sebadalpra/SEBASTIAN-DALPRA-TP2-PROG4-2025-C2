import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { estaLogueadoGuardGuard } from './esta-logueado-guard-guard';

describe('estaLogueadoGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => estaLogueadoGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
