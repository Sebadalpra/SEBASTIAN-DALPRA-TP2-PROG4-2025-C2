import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-estadisticas',
  imports: [ ],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas implements AfterViewInit {
  @ViewChild('myChart') myChartRef!: ElementRef<HTMLCanvasElement>; // esto es para referenciar el canvas (o sea el elemento que dibuja el chart)

  chart: Chart | null = null;

  ngAfterViewInit() {
    const ctx = this.myChartRef.nativeElement.getContext('2d'); // ctx es el contexto del canvas, o sea, el "lienzo" donde se dibuja
    
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

}
