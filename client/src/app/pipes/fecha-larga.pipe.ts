import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaLargaPipe' })
export class FechaLargaPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';
    const fecha = new Date(value);
    return fecha.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
