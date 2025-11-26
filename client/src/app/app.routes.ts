import { Routes } from '@angular/router';
import { rolGuard } from './guards/rol-guard';
import { estaLogueadoGuardGuard } from './guards/esta-logueado-guard-guard';

export const routes: Routes = [
    {
        path: '', redirectTo: 'publicaciones', pathMatch: 'full'
    },
    {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil),
        canActivate: [estaLogueadoGuardGuard]
    },
    {
        path: 'publicaciones',
        loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones)
    },
    {
        path: 'dashboard/usuarios',
        loadComponent: () => import('./pages/dashboard/usuarios/dashboard').then(m => m.Dashboard),
        canActivate: [rolGuard]
    },
    {
        path: 'dashboard/estadisticas',
        loadComponent: () => import('./pages/dashboard/estadisticas/estadisticas').then(m => m.Estadisticas),
        canActivate: [rolGuard]
    },
    { path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./pages/registro/registro').then(m => m.Registro)
    },
    {
        path: 'error',
        loadComponent: () => import('./pages/error/error').then(m => m.Error)
    },
    {
        path: '**',
        redirectTo: 'error'
    }
];
