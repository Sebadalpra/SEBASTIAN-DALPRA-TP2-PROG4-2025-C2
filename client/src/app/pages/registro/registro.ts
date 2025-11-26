import { Component, inject, Input, input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, FormsModule } from '@angular/forms';
import { min } from 'rxjs';
import Swal from 'sweetalert2';
import { Api } from '../../services/api';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  @Input() rolSeleccionado: string = 'user';
  @Input() esDesdeAdmin: boolean = false;

  grupoRegistro = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9]+$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{8,}$')]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{8,}$')]),
    fechaNacimiento: new FormControl('', [Validators.required, this.validarMayorDeEdad.bind(this)]),
    descripcion: new FormControl('', [Validators.maxLength(200)])
  },
  {validators: [this.validarPasswords]}
)

  validarPasswords(control: AbstractControl) : ValidationErrors | null {
    const password = control.get("password")?.value
    const confirmPassword = control.get("confirmPassword")?.value

    if (password != confirmPassword) {
      return {diferentes: true}
    }
    return null
  }

  validarMayorDeEdad(control: AbstractControl): ValidationErrors | null {
    const fechaNacimiento = control.value;
    if (!fechaNacimiento) {
      return null;
    }

    const fechaActual = new Date();
    const fechaUser = new Date(fechaNacimiento);

    let edad = fechaActual.getFullYear() - fechaUser.getFullYear();

    // a.si tiene 17 años y el mes de nacimiento es menor al actual: no es mayor de edad
    // b. si tiene 17 años y el mes es igual pero el dia de nacimiento es menor al actual: no es mayor de edad
    // c. en cualquier otro caso, es mayor de edad
    const mes = fechaActual.getMonth() - fechaUser.getMonth();
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaUser.getDate())) {
      edad--;
    }

    return edad >= 18 ? null : { menorDeEdad: true };
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

  private sesionService = inject(SesionService);


  // -----------------------------


  file?: File | null // no es obligatorio q la suban

  seleccionarArchivo( archivo: any ){
    const file_seleccionado = archivo.target.files[0];
    console.log("archivo seleccionado: " + file_seleccionado.name);
    this.file = file_seleccionado;
  }

    private router = inject(Router);
  
  enviarRegistro(){
    // Validar que las contraseñas coincidan
    if (this.grupoRegistro.errors?.['diferentes']) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Las contraseñas deben ser iguales.',
      });
      return;
    }

    // Validar que sea mayor de edad
    if (this.fechaNac?.errors?.['menorDeEdad']) {
      Swal.fire({
        icon: 'error',
        title: 'Edad insuficiente',
        text: 'Debes ser mayor de 18 años para registrarte.',
      });
      return;
    }

    // Validar que el formulario sea válido
    if (!this.grupoRegistro.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
      });
      return;
    }

    // Crear FormData con todos los campos incluyendo la foto
    const formData = new FormData();
    formData.append('nombre', this.nombre?.value || '');
    formData.append('apellido', this.apellido?.value || '');
    formData.append('email', this.email?.value || '');
    formData.append('username', this.userName?.value || '');
    formData.append('password', this.password?.value || '');
    formData.append('fecha_nacimiento', this.fechaNac?.value || '');
    formData.append('descripcion', this.descripcion?.value || '');
    
    // se agrega la foto solo si existe
    if (this.file) {
      formData.append('fotoPerfil', this.file);
    }

    // si desde el admin se selecciona un rol, se agrega al formData
    if (this.rolSeleccionado) {
      formData.append('rol', this.rolSeleccionado);
    }



    this.apiService.postCookie('auth/registro', formData).subscribe({
      next: () => {
        console.log('Registro exitoso');
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Registrado correctamente.',
        });
        
        // si es desde admin, NO loguear automáticamente
        if (this.esDesdeAdmin) {
          // solo resetear el formulario
          this.grupoRegistro.reset();
          return;
        }
        
        // sino loguear automaticamente tras registro
        this.apiService.postCookie('auth/login/cookie', {
          username: this.userName?.value || '',
          password: this.password?.value || ''
        }).subscribe({
          next: (response: any) => {
            console.log('login exitoso tras registro:', response);
            this.router.navigate(['/publicaciones']);
            this.sesionService.iniciarContador();
          },
          error: (error) => {
            console.error('Error en login tras registro:', error);
            this.router.navigate(['/login']);
          }
        });
      },
      // manejar error por si falta algún campo
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Hubo un error durante el registro. Por favor, verifica tus datos e intenta nuevamente.',
        });
        console.error('Error en el registro:', error);
        return "Error en el registro";
      }
    });
  }
}