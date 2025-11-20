import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private api = inject(Api);
  private router = inject(Router);
  
  private tiempoSesion = 2 * 60 * 1000; // 2 minutos en milisegundos
  private tiempoAdvertencia = 1 * 60 * 1000; // avisar cuando quede 1 minuto

  private temporizador: any;
  private modalMostrado = false;

  iniciarContador() {
    this.detenerContador();
    this.modalMostrado = false;
    
    // advertir cuando quede 1 min
    this.temporizador = setTimeout(() => {
      this.mostrarModalAviso();
    }, this.tiempoAdvertencia);
  }

  detenerContador() {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
      this.temporizador = null;
    }
  }

  private mostrarModalAviso() {
    if (this.modalMostrado) return; // si es true, no mostrar nuevamente
    this.modalMostrado = true;
    
    Swal.fire({
      title: 'Sesión por expirar',
      text: 'Te queda 1 minuto de sesión. Querés extender la sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Extender',
      cancelButtonText: 'Cerrar sesión',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.refrescarToken();
      } else {
        this.cerrarSesion();
      }
    });
  }

  private refrescarToken() {
    this.api.postCookie('auth/refresh/cookie', {}).subscribe({
      next: () => {
        Swal.fire({
          title: 'Sesión extendida',
          text: 'Tu sesión se ha renovada por 2 minutos más.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.iniciarContador(); // reiniciar el contador
      },
      error: (err) => {
        this.cerrarSesion();
      }
    });
  }

  private cerrarSesion() {
    this.detenerContador();
    this.router.navigate(['/login']);
  }
}
