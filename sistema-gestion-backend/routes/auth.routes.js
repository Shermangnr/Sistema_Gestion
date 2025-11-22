const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const router = express.Router();
require('dotenv').config();

// Obtener la clave secreta para firmar el Token
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ENDPOINT: POST /api/auth/login
 * Proceso de autenticación de usuario y emisión de JWT.
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Consulta SQL para verificar credenciales (la contraseña debería ir hasheada en un entorno real)
        const [rows] = await pool.query(
            'SELECT id, username, role, full_name FROM users WHERE username = ? AND password = ?', 
            [username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = rows[0];

        // 1. Definir el Payload (datos esenciales que viajan dentro del Token)
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role // CRUCIAL para la autorización en el middleware 'protect'
        };

        // 2. Crear el Token JWT, firmado con la clave secreta y con expiración de 24 horas
        const token = jwt.sign(
            payload, 
            JWT_SECRET, 
            { expiresIn: '24h' } 
        );

        // 3. Respuesta de éxito: Se devuelve el token y la información del usuario para el Frontend
        return res.status(200).json({
            message: 'Login exitoso',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                full_name: user.full_name // Se incluye el nombre para la UX del dashboard
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;