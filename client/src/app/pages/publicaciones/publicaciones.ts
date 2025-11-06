import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {

  publicacionesGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mensaje: new FormControl('', [Validators.required]),
    imagen: new FormControl('', [Validators.required])
  });

  apiService = inject(Api)

  file: File | null = null;

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
    if (!this.publicacionesGroup.valid || !this.file) {
      console.error('Faltan completar campos en el formulario o no hay archivo seleccionado');
      return;
    }

    // Crear FormData con todos los campos incluyendo la imagen
    const formData = new FormData();
    formData.append('titulo', this.publicacionesGroup.get("titulo")?.value || '');
    formData.append('mensaje', this.publicacionesGroup.get("mensaje")?.value || '');
    formData.append('imagen', this.file);

    this.apiService.postCookie('publicaciones', formData).subscribe({
      next: (res) => {
        console.log('Publicación creada exitosamente con imagen:', res);
        this.publicacionesGroup.reset();
        this.file = null;
        
        this.cargarPublicaciones();
      },
      error: (error) => {
        console.error('Error al crear publicación:', error);
      }
    });

  }

  cargarPublicaciones() {
    this.apiService.getData('publicaciones').subscribe({
      next: (data: any) => {
        this.publicaciones = data;
        console.log("Publicaciones cargadas:", this.publicaciones);
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
      }
    });
  }

  publicaciones: any[] = [];

  ngOnInit() {
    this.cargarPublicaciones();
  }


    
}
