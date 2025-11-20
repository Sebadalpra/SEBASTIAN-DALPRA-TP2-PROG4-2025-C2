import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { SesionService } from '../../services/sesion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private api = inject(Api);
  private router = inject(Router);
  private sesionService = inject(SesionService);

  // variables para manejar estados
  mensajeError: string = '';
  cargando: boolean = false;


  formIniciarSesion = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  // -------

  iniciarSesion() {
    if (this.formIniciarSesion.invalid) {
      this.mensajeError = 'Por favor completa todos los campos';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const credenciales = {
      username: this.formIniciarSesion.value.user,
      password: this.formIniciarSesion.value.password
    };

    this.api.postCookie('auth/login/cookie', credenciales).subscribe({
      next: (response: any) => {
        // token se guarda automáticamente en la cookie
        console.log('login exitoso:', response);

        this.sesionService.iniciarContador(); // iniciar el contador de sesion luego del login

        this.router.navigate(['/publicaciones']);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error en login:', error);
        
        if (error.status === 401) {
          this.mensajeError = 'Usuario o contraseña incorrectos';
        } else {
          this.mensajeError = 'Error al iniciar sesión. Intentá nuevamente';
        }
        
        this.cargando = false;
      }
    });
  }

}
