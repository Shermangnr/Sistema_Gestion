import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class ClientComponent implements OnInit {
  // Modelo para el formulario
  newRequest = {
    title: '',
    description: ''
  };
  
  // Array para la lista de solicitudes
  requests: any[] = [];
  
  // Variables de feedback al usuario
  feedbackMessage: string = '';
  isCreating: boolean = false; // Para deshabilitar el botón

  statusMap: { [key: string]: string } = {
    'Nueva': 'bg-warning text-dark',
    'En Progreso': 'bg-primary',
    'Esperando Cliente': 'bg-info',
    'Resuelta': 'bg-success'
  };

  constructor(private requestService: RequestService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadRequests(); // Cargar la lista al iniciar
  }

  onSubmit(): void {
    // Se usan las validaciones de minlength del HTML para deshabilitar el botón
    if (!this.newRequest.title || !this.newRequest.description || this.newRequest.title.length < 5 || this.newRequest.description.length < 10) {
        this.feedbackMessage = 'Por favor, complete los campos correctamente.';
        return;
    }

    this.isCreating = true;
    this.feedbackMessage = 'Enviando solicitud...';

    this.requestService.createRequest(this.newRequest).subscribe({
      next: (res) => {
        this.feedbackMessage = 'Solicitud enviada con éxito. ID: ' + res.requestId;
        this.newRequest = { title: '', description: '' }; // Limpiar formulario
        this.loadRequests(); // Recargar la lista
        this.cdr.detectChanges(); // Forzar actualización de vista
        
        // Ocultar mensaje después de 2 segundos
        setTimeout(() => { this.feedbackMessage = ''; this.cdr.detectChanges(); }, 2000);
      },
      error: (err) => {
        this.feedbackMessage = 'Error al crear solicitud: ' + (err.error?.message || 'Error de conexión.');
        this.cdr.detectChanges();
        setTimeout(() => { this.feedbackMessage = ''; this.cdr.detectChanges(); }, 5000);
      },
      complete: () => {
        this.isCreating = false;
      }
    });
  }

  // 2. Cargar Solicitudes
  loadRequests(): void {
    this.requestService.getRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.feedbackMessage = 'Error al cargar solicitudes: ' + (err.error?.message || 'Error de conexión.');
        this.cdr.detectChanges();
      }
    });
  }

  // 3. Obtener clase de color para el estado
  getStatusClass(status: string): string {
    return this.statusMap[status] || 'bg-secondary';
  }
}