import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  http = inject(HttpClient);

  local = 'http://localhost:3000';
  render = 'https://sebastian-dalpra-tp2-prog4-2025-c2-1.onrender.com';
  
  private baseUrl = this.local;

  postData(endpoint: string, data: any) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }

  postCookie(endpoint: string, data: any) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { withCredentials: true });
  }
  
/* 
  uploadFile(endpoint: string, file: File | null) {
    const formData = new FormData();
    if (file) {
      formData.append('foto', file); // solo si existe
    }

    return this.http.post(`${this.baseUrl}/${endpoint}`, formData);
  }
 */
  getData(endpoint: string) {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  /// metodo para tener la ruta completa de la imagen
  buildRutaImagen(filename: string): string {
    return `${this.baseUrl}/public/images/${filename}`;
  }

}






