import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Api {

  constructor(private http: HttpClient) { }

  postData(endpoint: string, data: any) {
    return this.http.post(`http://localhost:3000/${endpoint}`, data);
  }

}



