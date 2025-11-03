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

  postData(endpoint: string, data: any) {
    return this.http.post(`${this.render}/${endpoint}`, data);
  }

  uploadFile(endpoint: string, file: File | null) {
    const formData = new FormData();
    if (file) {
      formData.append('foto', file); // solo si existe
    }

    return this.http.post(`${this.render}/${endpoint}`, formData);
  }

  getData(endpoint: string) {
    return this.http.get(`${this.render}/${endpoint}`);
  }

}






