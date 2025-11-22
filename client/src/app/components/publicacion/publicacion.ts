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
  @Input() usuarioActual: string = ''; // username del usuario logueado

  nuevoComentario: string = '';
  
  cargandoLike = false;
  cargandoComentario = false;

  // estado de edición de comentarios
  comentarioEditando: string | null = null; // id del comentario en edición
  textoEditado: string = '';

  // paginación
  paginaActual = 1;
  limite = 5;
  totalComentarios = 0;
  mostrarTodos = false;

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

  //Validaciones previas:
  // 1.verificar si el usuario actual es dueño del comentario
  esDuenioComentario(comentario: any): boolean {
    return comentario.username === this.usuarioActual;
  }
  // 2. iniciar edicion de comentario
  editarComentario(comentario: any) {
    this.comentarioEditando = comentario._id;
    this.textoEditado = comentario.texto;
  }
  // 3. cancelar edicion
  cancelarEdicion() {
    this.comentarioEditando = null;
    this.textoEditado = '';
  }


  // ------- Guardar comentario editado
  guardarEdicion(comentarioId: string) {
    if (!this.textoEditado.trim()) return;

    this.api.editarComentario(this.publicacion._id, comentarioId, this.textoEditado).subscribe({
      next: (res: any) => {
        this.publicacion.comentarios = res.comentarios;
        this.cancelarEdicion(); // para volver al estado normal del input 
      },
      error: (err) => {
        console.error('Error al editar comentario:', err);
        alert('No se pudo editar el comentario');
      }
    });
  }

  // paginacion de comentarios

  verMasComentarios() {
    this.mostrarTodos = true;
  }
  verMenosComentarios() {
    this.mostrarTodos = false;
  }

  // obtener comentarios visibles (ordenados por más recientes primero)
  comentariosVisibles() {
    // ordenarlos por fecha (más recientes primero)
    const comentariosOrdenados = [...(this.publicacion.comentarios || [])].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    if (this.mostrarTodos) {
      return comentariosOrdenados;
    }
    // sino mostrar solo hasta 5 comentarios
    return comentariosOrdenados.slice(0, this.limite);
  }



  // verificar si hay más comentarios para mostrar
  hayMasComentarios(): boolean {
    return !this.mostrarTodos && this.publicacion.comentarios?.length > this.limite;
  }
}
