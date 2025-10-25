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
  });

  private apiService = inject(Api)

  crearPublicacion() {
    const titulo = this.publicacionesGroup.get("titulo")?.value;
    const mensaje = this.publicacionesGroup.get("mensaje")?.value;    
    const nuevaPublicacion = { titulo, mensaje };

    this.apiService.postData('publicaciones', nuevaPublicacion);

  }}
