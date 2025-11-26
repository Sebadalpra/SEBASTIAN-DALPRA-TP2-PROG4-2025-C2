import { Component, inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../../services/api';
import { Router, } from '@angular/router';
import Swal from 'sweetalert2';
import { Registro } from "../../registro/registro";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Registro, FormsModule ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private api = inject(Api);
  private router = inject(Router);

  usuarios: any[] = [];
  cargando = true;
  rolUsuario = '';

  ngOnInit() {
    this.verificarAdmin();
    this.cargarUsuarios();
  }

  verificarAdmin() {
    this.api.getDataConCookie('auth/data/cookie').subscribe({
      next: (datos: any) => {
        this.rolUsuario = datos.rol;
        if (datos.rol !== 'admin') {
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Solo administradores pueden acceder a esta página',
          }).then(() => {
            this.router.navigate(['/publicaciones']);
          });
        }
      },
      error: (err) => {
        console.error('Error al verificar usuario:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  cargarUsuarios() {
    this.api.getDataConCookie('usuarios').subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.cargando = false;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.cargando = false;
        if (error.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tenés permisos para ver el listado de usuarios',
          });
        }
      }
    });
  }

  alternarAltaBaja(usuario: any) {
    this.api.altaBajaUsuario(usuario._id).subscribe( {
      next: (data : any) => {
        usuario.activo = data.activo;
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `El usuario ${usuario.username} ha sido ${usuario.activo ? 'activado' : 'desactivado'}.`,
        });
      },
      error: (error) => {
        console.error('Error al cambiar estado del usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cambiar el estado del usuario. Intentá nuevamente.',
        });
      }
    })
  }

  
  mostrarDashboard = true;

  mostrarDashboardAdmin() {
    this.mostrarDashboard = true;
  }

  mostrarComponenteRegistro() {
    this.mostrarDashboard = false;
  }

  rolSeleccionado = '';
  
}
