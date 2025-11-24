import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isBrowser: boolean;

  constructor(
    private authService: AuthService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  canActivate(): boolean | UrlTree {
    
    // 1. Caso Servidor (SSR): 
    // Si estamos en el servidor, asumimos que el usuario está autenticado 
    // para evitar la redirección prematura y dejar que el navegador verifique.
    if (!this.isBrowser) {
      // El componente se renderizará, y el navegador hará la verificación real.
      return true; 
    }

    // 2. Caso Navegador (Hidratación/Navegación normal): 
    // Si estamos en el navegador, verificamos el localStorage.
    if (this.authService.isLoggedIn()) {
      return true; // Acceso permitido (Token encontrado en LocalStorage)
    } else {
      // Acceso denegado: redirigir al Login
      console.warn('Acceso denegado. Redirigiendo a login.');
      return this.router.createUrlTree(['/login']); 
    }
  }
}