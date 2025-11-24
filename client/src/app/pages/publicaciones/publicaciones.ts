import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Publicacion } from '../../components/publicacion/publicacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule, ReactiveFormsModule, Publicacion],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {

  publicacionesGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mensaje: new FormControl('', [Validators.required]),
    imagen: new FormControl(''),
  });

  apiService = inject(Api)
  usuarioActual: string = ''; // username del usuario logueado
  rolUsuario: string = 'user'; // rol del usuario ('user' o 'admin')

  file: File | null = null;

  // ordenamiento y paginación
  ordenActual: 'fecha' | 'likes' = 'fecha';
  paginaActual = 1;
  limite = 5; // publicaciones por página
  totalPublicaciones = 0;

  seleccionarArchivo( archivo: any ){
      const file_seleccionado = archivo.target.files[0];

      console.log("archivo seleccionado: " + file_seleccionado.name);
      this.file = file_seleccionado;
  }

  // Método para obtener la URL completa de la imagen
  buildRutaImagen(filename: string): string {
    return this.apiService.buildRutaImagen(filename);
  }

  crearPublicacion() {
    if (!this.publicacionesGroup.valid) {
      console.error('Faltan completar campos en el formulario de publicación');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos requeridos.',
      });
      return;
    }

    // Crear FormData con todos los campos incluyendo la imagen
    const formData = new FormData();
    formData.append('titulo', this.publicacionesGroup.get("titulo")?.value || '');
    formData.append('mensaje', this.publicacionesGroup.get("mensaje")?.value || '');
    formData.append('imagen', this.file || ' '); // si no hay archivo, enviar string vacio

    this.apiService.postCookie('publicaciones', formData).subscribe({
      next: (res) => {
        console.log('Publicación creada exitosamente con imagen:', res);
        Swal.fire({
          icon: 'success',
          title: 'Publicación creada',
          text: 'Tu publicación ha sido creada exitosamente.',
        });

        this.publicacionesGroup.reset();
        this.file = null;
        this.paginaActual = 1; // volver a la primera página
        
        this.cargarPublicaciones();
      },
      // manejar error si no esta autenticado
      error: (error) => {
        if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'No autenticado',
            text: 'Debes iniciar sesión para crear una publicación.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear la publicación.',
          });
        }
      }
    });

  }

  cargarPublicaciones() {
    this.apiService.getData('publicaciones').subscribe({
      next: (data: any) => {
        this.publicaciones = data;
        this.totalPublicaciones = data.length;
        this.ordenarPublicaciones();
        console.log("Publicaciones cargadas:", this.publicaciones);
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
      }
    });
  }

  publicaciones: any[] = [];


  // ----- ordenar y paginar: ----

  // ordenar publicaciones según el criterio seleccionado
  ordenarPublicaciones() {
    if (this.ordenActual === 'fecha') {
      this.publicaciones.sort((a, b) => {
        return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime(); // más recientes primero
      });
    } else {
      this.publicaciones.sort((a, b) => {
        return (b.likes?.length || 0) - (a.likes?.length || 0); // más likes primero
      });
    }
  }

  // cambiar el criterio de ordenamiento
  cambiarOrden(orden: 'fecha' | 'likes') {
    this.ordenActual = orden;
    this.paginaActual = 1; // resetear a la primera página
    this.ordenarPublicaciones();
  }

  
  // mostrarlas paginando con el for 
  publicacionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.limite;
    const fin = inicio + this.limite;
    return this.publicaciones.slice(inicio, fin);
  }

  // navegar entre páginas
  cambiarPagina(direccion: 'anterior' | 'siguiente') {
    if (direccion === 'anterior' && this.paginaActual > 1) {
      this.paginaActual--;
    } else if (direccion === 'siguiente' && this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
    }
  }

  // calcular el total de páginas
  totalPaginas(): number {
    return Math.ceil(this.totalPublicaciones / this.limite) // ceil redondea hacia arriba
  }

  // verificar si hay página anterior
  hayPaginaAnterior(): boolean {
    return this.paginaActual > 1;
  }

  // verificar si hay página siguiente
  hayPaginaSiguiente(): boolean {
    return this.paginaActual < this.totalPaginas();
  }





  ngOnInit() {
    this.cargarPublicaciones();
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    // si el usuario esta logueado obtener su nombre de usuario y rol
    this.apiService.getDataConCookie('auth/data/cookie').subscribe({
      next: (datos: any) => {
        this.usuarioActual = datos.user;
        this.rolUsuario = datos.rol || 'user'; // obtener el rol del token
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
  }


    
}
