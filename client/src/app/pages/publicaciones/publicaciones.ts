import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

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

  async crearPublicacion() {
    const titulo = this.publicacionesGroup.get("titulo")?.value;
    const mensaje = this.publicacionesGroup.get("mensaje")?.value;
    
    const nuevaPublicacion = { titulo, mensaje };

    console.log("Publicacion creada:", nuevaPublicacion);

    const response = await fetch('http://localhost:3000/publicaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaPublicacion),
    });
    const data = await response.json();
    console.log('Respuesta del servidor:', data);

  }}
