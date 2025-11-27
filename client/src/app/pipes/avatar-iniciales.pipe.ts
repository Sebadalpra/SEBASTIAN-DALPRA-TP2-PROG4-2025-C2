import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'inicialesPipe' })
export class InicialesPipe implements PipeTransform {
  transform(nombre: string, apellido: string): string {
    if (!nombre && !apellido) return '';
    const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : '';
    const inicialApellido = apellido ? apellido.charAt(0).toUpperCase() : '';
    return inicialNombre + inicialApellido;
  }
}
