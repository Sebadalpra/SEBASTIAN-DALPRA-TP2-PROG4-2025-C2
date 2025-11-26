import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, inject } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Api } from '../../../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas implements OnInit, AfterViewInit {
  private api = inject(Api);

  @ViewChild('chartPublicaciones') chartPublicacionesRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartComentarios') chartComentariosRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartComentariosPorPublicacion') chartComentariosPorPublicacionRef!: ElementRef<HTMLCanvasElement>;

  chartPublicaciones: Chart | null = null;
  chartComentarios: Chart | null = null;
  chartComentariosPorPublicacion: Chart | null = null;

  // Fechas
  fechaInicio: string = '';
  fechaFin: string = '';

  cargando = false;

  ngOnInit() {
    // Fechas por defecto: últimos 30 días
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    this.fechaInicio = hace30Dias.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];
  }

  ngAfterViewInit() {
    setTimeout(() => this.cargarEstadisticas(), 0);
  }

  cargarEstadisticas() {
    if (!this.fechaInicio || !this.fechaFin) return;

    this.cargando = true;

    Promise.all([
      this.cargarPublicacionesPorUsuario(),
      this.cargarComentariosTotales(),
      this.cargarComentariosPorPublicacion()
    ]).finally(() => this.cargando = false);
  }

  cargarPublicacionesPorUsuario() {
    return new Promise<void>((resolve) => {
      this.api.getPublicacionesPorUsuario(this.fechaInicio, this.fechaFin).subscribe({
        next: (data: any) => {
          this.crearGraficoPublicaciones(data);
          console.log("publicaciones por usuario data:", data);
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  cargarComentariosTotales() {
    return new Promise<void>((resolve) => {
      this.api.getComentariosTotales(this.fechaInicio, this.fechaFin).subscribe({
        next: (data: any) => {
          this.crearGraficoComentarios(data);
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  cargarComentariosPorPublicacion() {
    return new Promise<void>((resolve) => {
      this.api.getComentariosPorPublicacion(this.fechaInicio, this.fechaFin).subscribe({
        next: (data: any) => {
          this.crearGraficoComentariosPorPublicacion(data);
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  crearGraficoPublicaciones(data: any[]) {
    if (this.chartPublicaciones) this.chartPublicaciones.destroy();

    const ctx = this.chartPublicacionesRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartPublicaciones = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.username),
        datasets: [{
          label: 'Cantidad de publicaciones',
          data: data.map(d => d.cantidad),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  crearGraficoComentarios(data: any[]) {
    if (this.chartComentarios) this.chartComentarios.destroy();

    const ctx = this.chartComentariosRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartComentarios = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.fecha),
        datasets: [{
          label: 'Comentarios por día',
          data: data.map(d => d.cantidad),
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  crearGraficoComentariosPorPublicacion(data: any[]) {
    if (this.chartComentariosPorPublicacion) this.chartComentariosPorPublicacion.destroy();

    const ctx = this.chartComentariosPorPublicacionRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartComentariosPorPublicacion = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.titulo),
        datasets: [{
          label: 'Comentarios',
          data: data.map(d => d.cantidad),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)', 'rgba(83, 102, 255, 0.6)',
            'rgba(255, 99, 255, 0.6)', 'rgba(99, 255, 132, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
