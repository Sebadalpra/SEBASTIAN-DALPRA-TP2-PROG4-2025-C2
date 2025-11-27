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
  
  private baseUrl = this.render; // cambiar a this.render para producción

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

  getDataConCookie(endpoint: string) {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { withCredentials: true });
  }

  /// metodo para tener la ruta completa de la imagen
  buildRutaImagen(filename: string): string {
    return `${this.baseUrl}/public/images/${filename}`; 
  }


    // métodos para publicaciones: like, unlike, comentar
  likePublicacion(id: string) {
    return this.http.post(`${this.baseUrl}/publicaciones/${id}/like`, {}, { withCredentials: true });
  }

  unlikePublicacion(id: string) {
    return this.http.delete(`${this.baseUrl}/publicaciones/${id}/like`, { withCredentials: true });
  }

  comentarPublicacion(id: string, texto: string) {
    return this.http.post(`${this.baseUrl}/publicaciones/${id}/comentarios`, { texto }, { withCredentials: true });
  }

  editarComentario(publicacionId: string, comentarioId: string, nuevoTexto: string) {
    return this.http.put(`${this.baseUrl}/publicaciones/${publicacionId}/comentarios/${comentarioId}`, { texto: nuevoTexto }, { withCredentials: true });
  }

  eliminarPublicacion(publicacionId: string) {
    return this.http.delete(`${this.baseUrl}/publicaciones/${publicacionId}`, { withCredentials: true });
  }

  darDeBajaPublicacion(publicacionId: string) {
    return this.http.patch(`${this.baseUrl}/publicaciones/${publicacionId}/baja`, {}, { withCredentials: true });
  }

  // --- ESTADÍSTICAS ---
  
  getPublicacionesPorUsuario(fechaInicio: string, fechaFin: string) {
    return this.http.get(`${this.baseUrl}/estadisticas/publicaciones-por-usuario`, {
      params: { fechaInicio, fechaFin },
      withCredentials: true
    });
  }

  getComentariosTotales(fechaInicio: string, fechaFin: string) {
    return this.http.get(`${this.baseUrl}/estadisticas/comentarios-totales`, {
      params: { fechaInicio, fechaFin },
      withCredentials: true
    });
  }

  getComentariosPorPublicacion(fechaInicio: string, fechaFin: string) {
    return this.http.get(`${this.baseUrl}/estadisticas/comentarios-por-publicacion`, {
      params: { fechaInicio, fechaFin },
      withCredentials: true
    });
  }

  // ------- Alta y baja de usuarios (admin) ---
  altaBajaUsuario(id: string) {
    return this.http.patch(`${this.baseUrl}/usuarios/${id}/alta-baja`, {}, { withCredentials: true });
  }

}





