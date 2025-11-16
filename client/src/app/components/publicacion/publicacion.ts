import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  @Input() publicacion: any;

  nuevoComentario: string = '';
  
  cargandoLike = false;
  cargandoComentario = false;

  constructor(private api: Api) {}

  darLike() {
    if (this.cargandoLike) return;
    this.cargandoLike = true; // deshabilita el boton para evitar doble click en el proceso
    this.api.likePublicacion(this.publicacion._id).subscribe({
      next: (res: any) => {
        this.publicacion.likes = res.likes;
        this.cargandoLike = false;
      },
      error: () => { this.cargandoLike = false; }
    });
  }
  
  quitarLike() {
    if (this.cargandoLike) return;
    this.cargandoLike = true;
    this.api.unlikePublicacion(this.publicacion._id).subscribe({
      next: (res: any) => {
        this.publicacion.likes = res.likes;
        this.cargandoLike = false;
      },
      error: () => { this.cargandoLike = false; }
    });
  }

  comentar() {
    if (!this.nuevoComentario.trim() || this.cargandoComentario) return;
    this.cargandoComentario = true;
    this.api.comentarPublicacion(this.publicacion._id, this.nuevoComentario).subscribe({
      next: (res: any) => {
        this.publicacion.comentarios = res.comentarios;
        this.nuevoComentario = '';
        this.cargandoComentario = false;
      },
      error: () => { this.cargandoComentario = false; }
    });
  }

  buildRutaImagen(filename: string): string {
    return this.api.buildRutaImagen(filename);
  }
}
