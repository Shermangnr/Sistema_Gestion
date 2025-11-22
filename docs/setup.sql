CREATE DATABASE solicitudes_db;

USE solicitudes_db;

-- 1. Tabla USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Client', 'Support', 'Admin') NOT NULL,
    full_name VARCHAR(255)
);

-- 2. Tabla REQUESTS
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    support_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Nueva', 'En Progreso', 'Esperando Cliente', 'Resuelta') NOT NULL DEFAULT 'Nueva',
    support_response TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (support_id) REFERENCES users(id)
);


-- Insertar Usuarios de Prueba (Contraseña simple: 123456)
INSERT INTO users (username, password, role, full_name) VALUES
('cliente1@test.com', '123456', 'Client', 'Juan Pérez'),
('soporte1@test.com', '123456', 'Support', 'María Rodríguez'),
('admin1@test.com', '123456', 'Admin', 'Carlos Gómez');

-- Insertar una solicitud inicial 
INSERT INTO requests (client_id, title, description) VALUES
(1, 'Problema con Login', 'No puedo acceder a mi cuenta desde el nuevo navegador.'),
(1, 'Duda sobre facturación', 'Necesito información sobre mi última factura.');
