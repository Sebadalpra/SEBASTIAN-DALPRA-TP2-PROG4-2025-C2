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

  private apiService = inject(Api)

  file: File | null = null;

  seleccionarArchivo( archivo: any ){
      const file_seleccionado = archivo.target.files[0];

      console.log("archivo seleccionado: " + file_seleccionado.name);
      this.file = file_seleccionado;
  }

  crearPublicacion() {
    if (!this.publicacionesGroup.valid || !this.file) {
      console.error('Formulario inválido o no hay archivo seleccionado');
      return;
    }

    // Crear FormData con todos los campos
    const formData = new FormData();
    formData.append('titulo', this.publicacionesGroup.get("titulo")?.value || '');
    formData.append('mensaje', this.publicacionesGroup.get("mensaje")?.value || '');
    formData.append('imagen', this.file);

    this.apiService.postData('publicaciones', formData).subscribe({
      next: (res) => {
        console.log('publicación creada exitosamente:', res);
        this.publicacionesGroup.reset();
        this.file = null;
      },
      error: (error) => {
        console.error('error al crear publicación:', error);
      }
    });

  }






}


    
    
