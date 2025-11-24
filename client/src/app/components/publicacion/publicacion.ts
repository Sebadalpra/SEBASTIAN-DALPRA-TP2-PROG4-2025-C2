import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import Swal from 'sweetalert2';

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
  @Input() rolUsuario: string = 'user'; // rol del usuario ('user' o 'admin')

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
    // verificar si el usuario actual es dueño de la publicación
  esDuenioPublicacion(): boolean {
    return this.publicacion.username === this.usuarioActual;
  }

  // verificar si el usuario es admin
  esAdmin(): boolean {
    return this.rolUsuario === 'admin'; // esto 
  }

  // comentarios : 
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


  // 1. eliminar publicaciones del propio user
  async eliminarPublicacion() {
    const result = await Swal.fire({
      title: '¿Estás seguro de que querés eliminar esta publicación?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.api.eliminarPublicacion(this.publicacion._id).subscribe({
        next: () => {
          // Emitir evento o recargar la lista
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al eliminar publicación:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la publicación.',
          });
        }
      });
    }
  }

  // 2. dar de baja publicación solo si sos admin
  async darDeBajaPublicacion() {
    const result = await Swal.fire({
      title: '¿Dar de baja esta publicación?',
      text: 'La publicación y sus comentarios dejarán de estar disponibles',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      this.api.darDeBajaPublicacion(this.publicacion._id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Publicación dada de baja',
            text: 'La publicación ya no estará disponible',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.reload(); // recargar par reflejar cambios
          });
        },
        error: (err) => {
          console.error('Error al dar de baja:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo dar de baja la publicación',
            icon: 'error'
          });
        }
      });
    }
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
