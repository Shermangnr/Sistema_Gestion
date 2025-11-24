import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core'; 
import { Router, RouterOutlet, RouterModule } from '@angular/router'; 
import { CommonModule, isPlatformBrowser, TitleCasePipe } from '@angular/common'; 
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, TitleCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit{
  
  userRole: string | null = null;
  userName: string = 'Usuario Desconocido';
  userEmail: string = '';
  isBrowser: boolean; 

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Solo verificar si esta en el navegador
    if (this.isBrowser) {
        this.userRole = this.authService.getUserRole();

        // Obtener Nombre y Email
        const userInfo = this.authService.getUserInfo();
        if (userInfo) {
            
            this.userName = userInfo.full_name || userInfo.username; 
            this.userEmail = userInfo.username; // Usaremos esto para el avatar
        }
        
        // Si no hay rol (o el token expiró), forzar logout y redirigir
        if (!this.userRole) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }

        // Redirección si la URL actual no coincide con el rol (ej. entrar a /dashboard sin /client)
        const currentPath = this.router.url;
        if (currentPath === '/dashboard') {
            switch (this.userRole) {
                case 'Client': this.router.navigate(['/dashboard/client']); break;
                case 'Support': this.router.navigate(['/dashboard/support']); break;
                case 'Admin': this.router.navigate(['/dashboard/admin']); break;
            }
        }
    }
  }

  // Lógica para cerrar sesión
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}