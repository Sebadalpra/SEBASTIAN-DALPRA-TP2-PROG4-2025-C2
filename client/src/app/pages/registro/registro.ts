import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { min } from 'rxjs';
import Swal from 'sweetalert2';
import { Api } from '../../services/api';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule],
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
    descripcion: new FormControl([Validators.required, Validators.maxLength(200)])
  },
  {validators: [this.validarPasswords]} // validador de grupo ya que uso 2 campos y evito acceder al control.parents
)

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

  validarPasswords(control: AbstractControl) : ValidationErrors | null {
    const password = control.get("password")?.value
    const confirmPassword = control.get("confirmPassword")?.value

    if (password != confirmPassword) {
      return {iguales: false}
    }
    return null
  }

  // hacer logica para validar si es mayor de edad

  private apiService = inject(Api)
  
  enviarRegistro(){
    // tiene que ir la logica para enviar el form si es correcto a la api
    this.apiService.postData('usuarios', this.grupoRegistro)
  }
}