import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Para obtener el JWT

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // 1. Función para adjuntar el JWT a cada petición
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Formato estándar de JWT
    });
  }

  // 2. Crear Solicitud (Cliente)
  createRequest(data: { title: string, description: string }): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  // 3. Listar Solicitudes (Todos los Roles)
  getRequests(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // 4. Actualizar Solicitud (Soporte/Admin)
  updateRequest(id: number, data: { status?: string, support_response?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }
}