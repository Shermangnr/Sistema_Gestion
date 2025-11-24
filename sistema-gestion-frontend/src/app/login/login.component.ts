import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  // Usamos loginData para que coincida con el HTML
  loginData = {
    username: '', 
    password: ''
  };
  errorMessage: string = '';
  // Propiedad para deshabilitar el botón durante la petición
  isLoading: boolean = false; 

  // Inyectamos el servicio de autenticación y el router
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  // Usamos 'login' para que coincida con (ngSubmit)="login()"
  login(): void {
    this.errorMessage = ''; 
    this.isLoading = true; // Activar el spinner al iniciar la petición

    // 1. Llamar al servicio de Login (petición POST al Backend)
    this.authService.login(this.loginData).subscribe({ // Usar loginData
      next: (response) => {
        // 2. Éxito: Guardamos el JWT y el rol
        this.authService.setSession(response.token, response.user);
        this.isLoading = false; // Desactivar al finalizar
        
        // 3. Redirección por Rol 
        const role = response.user.role;
        
        switch (role) {
          case 'Client':
            this.router.navigate(['/dashboard/client']);
            break;
          case 'Support':
            this.router.navigate(['/dashboard/support']);
            break;
          case 'Admin':
            this.router.navigate(['/dashboard/admin']);
            break;
          default:
            this.authService.logout(); 
            this.errorMessage = 'Rol de usuario no reconocido.';
        }
      },
      error: (err) => {
        // 4. Error: Mostrar mensaje de error (ej. Credenciales inválidas)
        this.errorMessage = err.error?.message || 'Error de conexión con el servidor.';
        this.isLoading = false; // Desactivar al finalizar el spinner
      }
    });
  }
}