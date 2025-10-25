import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {

  async postData(endpoint: string, data: any) {
    const resp = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )
  console.log(`Enviado a '${endpoint}'`)
  return resp
 }

}



