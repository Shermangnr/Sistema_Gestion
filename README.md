# 🚀 Prueba Técnica Frontend: Sistema de Gestión de Solicitudes

Este proyecto implementa un sistema de gestión de solicitudes con autenticación basada en roles (Cliente, Soporte, Administrador) desarrollado según los requisitos mínimos y extras valorados de la prueba técnica.

El objetivo fue simular un flujo de soporte real, priorizando la **lógica de negocio**, la **seguridad de acceso**, y una **Experiencia de Usuario (UX/UI) profesional**.

---

## 💻 1. Arquitectura y Tecnologías Usadas

El sistema está dividido en dos servicios independientes comunicados a través de una API RESTful.

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | **Angular (Standalone)** | Interfaz de usuario dinámica y gestión de estados de sesión. |
| **Estilos/UX** | **Bootstrap 5 & CSS** | Diseño responsivo, componentes listos y estilo moderno (*Glassmorphism* en el Login). |
| **Análisis** | **Chart.js** | Generación de gráficos en el Dashboard del Administrador. |
| **Backend** | **Node.js (Express)** | API RESTful para la lógica de negocio y persistencia de datos. |
| **Base de Datos** | **MySQL** | Almacenamiento de `users` y `requests`. |
| **Seguridad** | **JSON Web Tokens (JWT)** | Autenticación de sesiones y control de acceso (protección de rutas). |

---

## 🛠️ 2. Configuración y Ejecución del Proyecto

Sigue estos pasos para levantar el sistema completo (Backend y Frontend).

### 2.1. Configuración de la Base de Datos

1.  Asegúrate de tener un servidor MySQL 8.0 corriendo.
2.  Crea una base de datos vacía llamada **`solicitudes_db`**.
3.  Ejecuta el script SQL de inicialización (**`docs/setup.sql`**) para crear las tablas (`users`, `requests`) y poblar los usuarios de prueba.

### 2.2. Configuración del Backend (API REST)

*Navegar a la carpeta del backend
cd sistema-gestion-backend

1. Configurar variables de entorno
Crear un archivo llamado .env en la raíz del backend con:
- DB_USER=root
- DB_PASSWORD=TuContraseñaMySQL
- DB_NAME=solicitudes_db
- JWT_SECRET=TuClaveSecretaLarga

2. Instalar dependencias
npm install

3. Iniciar el servidor (Usando nodemon para desarrollo)
npm run dev
La API se ejecutará en http://localhost:3000

### 2.3. Configuración del Frontend (Angular)

Navegar a la carpeta del frontend
cd sistema-gestion-frontend

1. Instalar dependencias
npm install

2. Iniciar el servidor
ng serve --open
La aplicación se abrirá en http://localhost:4200

## 🔑 3. Credenciales de Prueba

- Utiliza estas credenciales para probar los flujos de cada rol (la contraseña es 123456 para todos):

| Rol | Usuario | Nombre Completo |
| :--- | :--- | :--- |
| **Administrador** | `admin1@test.com` | Carlos Gómez |
| **Soporte** | `soporte1@test.com` | María Rodríguez |
| **Cliente** | `cliente1@test.com` | Juan Pérez |

## ✨ 4. Funcionalidades Implementadas (Por Rol)
A. Lógica de Roles y Flujo de Soporte
Flujo de Asignación: Cuando un usuario de Soporte atiende un ticket en estado Nueva y lo cambia a En Progreso, el sistema automáticamente asigna el ticket a su support_id en la base de datos.

B. Funcionalidades por Panel

| Rol | Funcionalidades |
| :--- | :--- |
| **Cliente** | Creación de Solicitudes (con validación de longitud). Listado de tickets propios, ordenados por prioridad de estado (`Nueva` $\rightarrow$ `En Progreso`). |
| **Soporte** | Listado de tickets que requieren acción (estado `Nueva` o asignados a él). Opción de **actualizar estado** y **redactar respuesta** para el cliente. Muestra el nombre del soporte asignado. |
| **Administrador** | Listado general de **TODAS** las solicitudes. Filtro por estado. Vista de **estadísticas** (tarjetas de conteo y gráfico de barras (Chart.js)) para análisis visual. |


### 5. Aspectos a Mejorar (Oportunidades Futuras)

Si tuviera más tiempo, me enfocaría en los siguientes puntos para llevar el sistema a nivel de producción y mejorar la experiencia del usuario y la capacidad de análisis:

#### A. Lógica y Flujo de Trabajo (Business Logic)

* **Gestión del Soporte:**
    * **Dashboard Flexible:** Separar la vista de tickets en filtros: **'Mis Tickets'** (solo asignados al usuario) y **'Tickets Disponibles'** (`Nueva` o no asignados) para una mejor priorización.
    * **Restricción Post-Resolución:** Deshabilitar el `textarea` de respuesta de soporte en el Frontend cuando el ticket esté en estado **'Resuelta'** para proteger el historial de la solución.
    * **Alerta de Servicio:** Implementar un indicador visual en el Panel de Soporte para tickets en estado **'Nueva'** que hayan permanecido sin atención por más de **2 horas**, urgiendo a un cambio de estado a 'En Progreso'.
* **Rol Cliente:** Clarificar que el rol **Cliente** solo interactúa con la plataforma para la **creación** y **consulta** de solicitudes, sin ninguna otra capacidad de gestión.

#### B. Análisis y Administración (Admin Panel)

* **Balance de Carga y Gráficos:** Desarrollar un **gráfico de distribución** que visualice los tickets asignados por cada agente de soporte, incluyendo filtros por periodo de tiempo (ej., 1 Semana / 1 Mes) para evaluar la carga laboral.
* **Métricas de Desempeño:** Implementar una funcionalidad para calcular el **tiempo de servicio** (tiempo transcurrido desde 'En Progreso' hasta 'Resuelta') para medir la eficiencia del equipo.
* **Gestión de Usuarios:** Agregar una funcionalidad **CRUD** (Crear, Editar, Eliminar) para administrar usuarios (Clientes, Soporte, Administradores) directamente desde la interfaz.

#### C. Arquitectura y Calidad de Código

* **Pruebas Unitarias:** Implementar pruebas unitarias básicas en el Backend (para *endpoints* críticos como Login y `protect` middleware) y en el Frontend (para la lógica de servicios).
* **Seguridad (Hashing):** Implementar *hashing* de contraseñas (ej. bcrypt) en el Backend.
* **Mejoras de UX/UI:** Implementar un **botón (menú hamburguesa)** que permita compactar/expandir el Sidebar en diferentes resoluciones para mejorar el espacio de trabajo.
