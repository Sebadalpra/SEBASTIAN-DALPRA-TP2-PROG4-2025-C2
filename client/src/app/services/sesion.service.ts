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
  
  private tiempoSesion = 4 * 60 * 1000; // 4 minutos de sesion
  private tiempoAdvertencia = 2 * 60 * 1000; // avisar cuando quede 2 minutos

  private temporizador: any = null;

  private modalMostrado = false;
  private inicioSesion: number = 0;

  iniciarContador() {
    this.detenerContador();
    this.modalMostrado = false;
    this.inicioSesion = Date.now();

    // advertir cuando queden 2 min
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
      text: 'Te quedan 2 minutos de sesión. Querés extender la sesión?',
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
          text: 'Tu sesión se ha renovada por 4 minutos más.',
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

  // esperar el tiempo restante real cuando el usuario cancela
  private esperarExpiracion() {

    const tiempoTranscurrido = Date.now() - this.inicioSesion; // tiempo actual - el momento en que el usuario inició sesión
    const tiempoRestante = this.tiempoSesion - tiempoTranscurrido; // 4 min - tiempo transcurrido
    
    this.temporizador = setTimeout(() => {
      this.cerrarSesion();
    }, tiempoRestante > 0 ? tiempoRestante : 0); // 
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
