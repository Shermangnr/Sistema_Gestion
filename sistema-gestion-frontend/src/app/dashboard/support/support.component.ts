import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class SupportComponent implements OnInit {
  // Array que almacena la lista de tickets para el Soporte
  requests: any[] = [];
  // Mensaje de feedback para el usuario (éxito/error)
  feedbackMessage: string = '';
  // Objeto para manejar la edición y actualización de la solicitud seleccionada
  selectedRequest: any = null; 
  // Opciones de estado disponibles para el rol de Soporte/Admin
  statusOptions = ['En Progreso', 'Resuelta', 'Esperando Cliente'];

  constructor(private requestService: RequestService, private cdr: ChangeDetectorRef) { 
    // Llamada inicial en el constructor para asegurar la carga inmediata (solución a bug SSR)
    this.loadRequests();
  }

  ngOnInit(): void {
    // La carga se mantiene aquí para navegación, aunque el constructor ya la asegura al inicio
    this.loadRequests();
  }

  // --- LÓGICA DE CARGA ---
  // Obtener los tickets.
  loadRequests(): void {
    this.feedbackMessage = '';
    this.requestService.getRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.cdr.detectChanges(); // Forzar actualización de la lista
      },
      error: (err) => {
        this.feedbackMessage = 'Error al cargar solicitudes: ' + (err.error?.message || 'Error de conexión.');
        this.cdr.detectChanges();
      }
    });
  }

  // --- LÓGICA DE EDICIÓN ---
  // Selecciona un ticket para abrir el formulario de edición
  selectRequest(request: any): void {
    // Clonar el objeto para no modificar el listado directamente
    this.selectedRequest = { ...request }; 
    // Lógica de Negocio: Si el ticket está en estado 'Nueva', se asume 'En Progreso' al seleccionarlo
    if (this.selectedRequest.status === 'Nueva') {
        this.selectedRequest.status = 'En Progreso';
    }
  }

  // --- LÓGICA DE ACTUALIZACIÓN ---
  // Envía los cambios de estado y respuesta al Backend
  updateRequest(): void {
    // Validación mínima
    if (!this.selectedRequest || !this.selectedRequest.status) {
      this.feedbackMessage = 'Debe seleccionar una solicitud y un estado.';
      return;
    }
    
    // Preparar datos para la API
    const updateData = {
      status: this.selectedRequest.status,
      support_response: this.selectedRequest.support_response || ''
    };

    // La API se encarga de: 
    // 1. Asignar support_id al usuario logueado si es Soporte (y no estaba asignado).
    // 2. Aplicar los cambios.
    this.requestService.updateRequest(this.selectedRequest.id, updateData).subscribe({
      next: (response) => {
        const updatedId = response.requestId;
        
        // Feedback detallado al usuario (UX)
        this.feedbackMessage = `¡Éxito! Solicitud #${updatedId} actualizada a: ${this.selectedRequest.status}.`;
        
        this.selectedRequest = null; // Cerrar la edición
        this.loadRequests(); // Recargar la lista para mostrar los cambios
        
        this.cdr.detectChanges(); 
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            this.feedbackMessage = '';
            this.cdr.detectChanges(); 
        }, 3000); 
      },
      error: (err) => {
        this.feedbackMessage = 'Error al actualizar: ' + (err.error?.message || 'Error de conexión.');
        this.cdr.detectChanges(); 
      }
    });
  }
}