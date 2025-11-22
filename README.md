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
