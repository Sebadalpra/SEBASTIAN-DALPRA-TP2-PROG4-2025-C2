import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, FormsModule } from '@angular/forms';
import { min } from 'rxjs';
import Swal from 'sweetalert2';
import { Api } from '../../services/api';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  grupoRegistro = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9]+$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(200)])
  },
  {validators: [this.validarPasswords]}
)

  validarPasswords(control: AbstractControl) : ValidationErrors | null {
    const password = control.get("password")?.value
    const confirmPassword = control.get("confirmPassword")?.value

    if (password != confirmPassword) {
      return {iguales: false}
    }
    return null
  }

  get nombre() {
    return this.grupoRegistro.get("nombre")
  }
  get apellido() {
    return this.grupoRegistro.get("apellido")
  }
  get email() {
    return this.grupoRegistro.get("email")
  }
  get edad() {
    return this.grupoRegistro.get("edad")
  }
  get password() {
    return this.grupoRegistro.get("password")
  }
  get confirmPassword() {
    return this.grupoRegistro.get("confirmPassword")
  }
  get fechaNac() {
    return this.grupoRegistro.get("fechaNacimiento")
  }
  get descripcion(){
    return this.grupoRegistro.get("descripcion")
  }
  get userName() {
    return this.grupoRegistro.get("userName")
  }


  // hacer logica para validar si es mayor de edad
  private apiService = inject(Api)

  file?: File | null // no es obligatorio q la suban

  seleccionarArchivo( archivo: any ){
    const file_seleccionado = archivo.target.files[0];

    console.log("archivo seleccionado: " + file_seleccionado.name);
    this.file = file_seleccionado;


    this.apiService.uploadFile('upload', this.file!).subscribe({
      next: (data) => {
        console.log("archivo subido correctamente", data);
      },
      error: (error) => {
        console.error("Error al subir el archivo", error);
      }
    });
  }


  
  enviarRegistro(){
    // definir los mismos campos que el dto del back
    const usuario = {
      nombre: this.nombre?.value,
      apellido: this.apellido?.value,
      email: this.email?.value,
      username: this.userName?.value,
      password: this.password?.value,
      fecha_nacimiento: this.fechaNac?.value,
      descripcion: this.descripcion?.value
    }

    this.apiService.postData('auth/registro', usuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada correctamente.',
        });
      }
      ,error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: error.error.message,
        });
      }
    });
  }
}