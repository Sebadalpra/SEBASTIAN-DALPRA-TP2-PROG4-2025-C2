import { Component, inject, Inject, Signal, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink, Router, NavigationEnd } from '@angular/router';
import { Api } from './services/api';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');

  api = inject(Api) as any;
  router = inject(Router);

  rolUsuario = signal<string>(''); // admin o user

  esAdmin() {
    this.api.getDataConCookie('auth/data/cookie').subscribe({
      next: (datos: any) => {
        this.rolUsuario.set(datos.rol || '');
      },
      error: (err: any) => {
        this.rolUsuario.set('');
      }
    });
  }

  constructor() {
    this.esAdmin();
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { // actualizar rol cada vez que cambie la ruta
        this.esAdmin();
      }
    });
  }



  
  



}
