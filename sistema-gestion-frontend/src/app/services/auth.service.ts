import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // URL del Backend

  private isBrowser: boolean;

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // 1. Método para la petición de Login
  login(credentials: any): Observable<any> {
    // Hace la petición POST al endpoint del Backend
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // 2. Almacenar el Token y el Usuario
  setSession(token: string, user: any): void {
    if (this.isBrowser) {
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_info', JSON.stringify(user));
    }
  }

  // 3. Obtener el Rol
  getUserRole(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('user_role');
    }
    return null;
  }

  // 4. Verificar si está logueado (solo revisamos si hay token)
  isLoggedIn(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('jwt_token');
    }
    return false;
  }

  // 5. Cerrar sesión
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_info');
    }
  }

  // Función para obtener el token 
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  // Obtener la información completa del usuario
  getUserInfo(): any | null {
    if (this.isBrowser) {
      const userInfoString = localStorage.getItem('user_info');
      if (userInfoString) {
        // Devolvemos el objeto JSON parseado
        return JSON.parse(userInfoString);
      }
    }
    return null;
  }
}