import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: 'publicaciones', pathMatch: 'full'
    },
    {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil)
    },
    {
        path: 'publicaciones',
        loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones)
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
