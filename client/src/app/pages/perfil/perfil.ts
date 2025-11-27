import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Publicacion } from '../../components/publicacion/publicacion';
import { Registro } from '../registro/registro';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { FechaLargaPipe } from '../../pipes/fecha-larga.pipe';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, Publicacion, CapitalizePipe, FechaLargaPipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  usuario: any = null;
  publicaciones: any[] = [];
  cargando = true;
  error = '';

  constructor(private api: Api) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.cargando = true;
    this.error = '';
    
    this.api.getDataConCookie('auth/data/cookie').subscribe({
      next: (datos: any) => {
        const username = datos.user; // 1. obtener el username del usuario logueado
        console.log("user: ", username);
        
        // ----- 2. obtener todos los datos del usuario
        this.api.getDataConCookie(`usuarios/${username}`).subscribe({
          next: (usuario: any) => {
            this.usuario = usuario;
            this.cargarPublicaciones(username);
          },
          error: (err) => {
            this.error = 'Error al cargar los datos del usuario';
            this.cargando = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Error de autenticación';
        this.cargando = false;
      }
    });
  }

  cargarPublicaciones(username: string) {
    this.api.getData('publicaciones').subscribe({
      next: (publicaciones: any) => {
        // filtrar las publicaciones del usuario y tomar las últimas 3
        this.publicaciones = publicaciones.filter((pub: any) => pub.username === username)
          .sort((a: any, b: any) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
          .slice(0, 3);
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las publicaciones';
        this.cargando = false;
      }
    });
  }

  buildRutaImagen(filename: string): string {
    return this.api.buildRutaImagen(filename);
  }


  
}
