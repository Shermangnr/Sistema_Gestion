import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './dashboard/client/client.component';
import { SupportComponent } from './dashboard/support/support.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
    // Ruta por defecto: Login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Ruta del Login
    { path: 'login', component: LoginComponent },

    // Dashboard (Ruta protegida y con rutas hijas por rol)
    {
        path: 'dashboard',
        component: DashboardComponent,
        // Proteccion de rutas con Guard
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        children: [
            // Cliente: Ruta por defecto del dashboard
            { path: '', redirectTo: 'client', pathMatch: 'full' },
            { path: 'client', component: ClientComponent },

            // Soporte
            { path: 'support', component: SupportComponent },

            // Administrador
            { path: 'admin', component: AdminComponent },

            // Manejo de roles: Más adelante usaremos un RoleGuard
        ]
    },

    // Ruta comodín para cualquier otra URL (Página 404)
    { path: '**', redirectTo: 'login' }
];

export class AppRoutingModule { }