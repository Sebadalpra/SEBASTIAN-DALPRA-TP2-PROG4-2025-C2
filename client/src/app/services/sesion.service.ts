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
  
  // private tiempoSesion = 2 * 60 * 1000; // 2 minutos de sesion
  private tiempoAdvertencia = 1 * 60 * 1000; // avisar cuando quede 1 minuto

  private temporizador: any = null;
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
      cancelButtonText: 'Continuar sin extender',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.refrescarToken();
      } else {
        this.esperarExpiracion();
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

  // esperar el minuto restante cuando el usuario cancela
  private esperarExpiracion() {
    this.temporizador = setTimeout(() => {
      this.cerrarSesion();
    }, 1 * 60 * 1000); // 1 min mas
  }

  private cerrarSesion() {
    this.detenerContador();
    Swal.fire({
      title: 'Sesión finalizada',
      text: 'Tu sesión ha finalizado. Serás redirigido al inicio de sesión.',
      icon: 'info',
      timer: 3000,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
