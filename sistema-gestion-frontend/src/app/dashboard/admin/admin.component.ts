import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RequestService } from '../../services/request.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChild('statsChart') chartCanvas!: ElementRef;

  requests: any[] = [];
  feedbackMessage: string = '';
  filterStatus: string = '';
  statusCounts: { [key: string]: number } = {};
  allStatuses = ['Nueva', 'En Progreso', 'Esperando Cliente', 'Resuelta'];
  private chartInstance: Chart | undefined;

  constructor(private requestService: RequestService, private cdr: ChangeDetectorRef) {
    this.loadAllRequests();
  }

  ngOnInit(): void {
    this.loadAllRequests();
  }

  ngAfterViewInit(): void {
    // Si los datos ya se cargaron, dibujar el gráfico
    if (Object.keys(this.statusCounts).length > 0) {
      this.renderChart();
    }
  }

  // Cargar TODAS las Solicitudes
  loadAllRequests(): void {
    this.feedbackMessage = 'Cargando solicitudes...';
    this.requestService.getRequests().subscribe({
      next: (data) => {
        // El Backend (rol Admin) devuelve TODAS las solicitudes
        this.requests = data;
        this.calculateStats(data);
        this.feedbackMessage = 'Solicitudes cargadas correctamente.';

        this.cdr.detectChanges(); // Forzar la actualización

        // Renderizar el gráfico justo después de calcular las estadísticas y detectar cambios
        this.renderChart();

        setTimeout(() => {
          this.feedbackMessage = '';
        }, 2000);
      },
      error: (err) => {
        this.feedbackMessage = 'Error al cargar solicitudes: ' + (err.error?.message || 'Error de conexión.');
        this.cdr.detectChanges();
        setTimeout(() => {
          this.feedbackMessage = '';
        }, 5000);
      }
    });
  }

  // Lógica para calcular las estadísticas (Requisito: Estadísticas simples)
  calculateStats(data: any[]): void {
    this.statusCounts = {};
    data.forEach(req => {
      const status = req.status;
      this.statusCounts[status] = (this.statusCounts[status] || 0) + 1;
    });
  }

  // Función para dibujar el gráfico
  renderChart(): void {
    if (!this.chartCanvas) return; // Salir si el canvas no está listo

    // Preparar datos y etiquetas
    const labels = this.allStatuses;
    const dataValues = this.allStatuses.map(status => this.statusCounts[status] || 0);
    const backgroundColors = [
      '#ffc107', // Nueva (Warning)
      '#0d6efd', // En Progreso (Primary)
      '#0dcaf0', // Esperando Cliente (Info)
      '#198754'  // Resuelta (Succes)
    ];

    // Destruir la instancia anterior si existe (necesario si se llama varias veces)
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Crear la nueva instancia de gráfico de barras
    this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar', // Tipo de gráfico: Barras
      data: {
        labels: labels,
        datasets: [{
          label: 'Conteo de Solicitudes',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1, // Asegura que solo se muestren números enteros
            }
          }
        }
      }
    });
  }

  // Propiedad para el listado filtrado en el HTML
  get filteredRequests(): any[] {
    if (!this.filterStatus) {
      return this.requests; // Mostrar todos si no hay filtro
    }
    // Filtrar por el estado seleccionado
    return this.requests.filter(req => req.status === this.filterStatus);
  }

  // Función para obtener la clase de color para las estadísticas
  getStatusClass(status: string): string {
    switch (status) {
      case 'Nueva': return 'bg-warning text-dark';
      case 'En Progreso': return 'bg-primary';
      case 'Resuelta': return 'bg-success';
      case 'Esperando Cliente': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}