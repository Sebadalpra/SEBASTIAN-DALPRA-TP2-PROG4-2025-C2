import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

}



