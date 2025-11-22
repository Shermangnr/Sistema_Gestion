const express = require('express');
const { pool } = require('../db');
const { protect, authorizeRole } = require('../middleware/auth.middleware'); // Importar los Guards
const router = express.Router();

// ----------------------------------------------------------------------
// 1. ENDPOINT DE CREACIÓN DE SOLICITUD (CLIENTE)
// POST /api/requests
// ----------------------------------------------------------------------
// Solo los Clientes pueden crear solicitudes
router.post('/', protect, authorizeRole('Client'), async (req, res) => {
    const { title, description } = req.body;
    // req.user.id viene del JWT que se verificó en 'protect'
    const client_id = req.user.id;

    if (!title || !description) {
        return res.status(400).json({ message: 'Título y descripción son obligatorios.' });
    }

    try {
        const query = 'INSERT INTO requests (client_id, title, description, status) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(query, [client_id, title, description, 'Nueva']);

        res.status(201).json({
            message: 'Solicitud creada exitosamente',
            requestId: result.insertId
        });
    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear solicitud.' });
    }
});

// ----------------------------------------------------------------------
// 2. ENDPOINT DE LISTADO DE SOLICITUDES (Por Rol)
// GET /api/requests
// ----------------------------------------------------------------------
router.get('/', protect, async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;
    let query;
    let params = [];

    // Lógica de filtrado según el Rol
    switch (role) {
        case 'Client':
            // Clientes solo ven sus propias solicitudes
            query = `
                SELECT r.*, u.full_name AS client_name 
                FROM requests r 
                JOIN users u ON r.client_id = u.id
                WHERE r.client_id = ? 
                ORDER BY FIELD(r.status, 'Nueva', 'En Progreso', 'Esperando Cliente', 'Resuelta'), r.created_at DESC`;
            params = [userId];
            break;

        case 'Support':
            // Soporte ve solicitudes asignadas A ÉL o solicitudes NUEVAS (sin asignar)
            query = `
                SELECT r.*, u.full_name AS client_name, s.full_name AS support_name
                FROM requests r 
                JOIN users u ON r.client_id = u.id
                LEFT JOIN users s ON r.support_id = s.id  
                WHERE r.support_id IS NULL OR r.support_id = ?
                ORDER BY r.status, r.created_at DESC`;
            params = [userId];
            break;

        case 'Admin':
            // Administrador ve TODAS las solicitudes
            query = `
                SELECT r.*, u.full_name AS client_name, s.full_name AS support_name
                FROM requests r 
                JOIN users u ON r.client_id = u.id
                LEFT JOIN users s ON r.support_id = s.id  -- AGREGADO
                ORDER BY r.created_at DESC`;
            break;

        default:
            return res.status(403).json({ message: 'Rol no autorizado para listar solicitudes.' });
    }

    try {
        const [rows] = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al listar solicitudes:', error);
        res.status(500).json({ message: 'Error interno del servidor al listar solicitudes.' });
    }
});

// ----------------------------------------------------------------------
// 3. ENDPOINT DE ACTUALIZACIÓN (SOPORTE/ADMIN) - Cambiar Estado y Responder
// PUT /api/requests/:id
// ----------------------------------------------------------------------
router.put('/:id', protect, authorizeRole(['Support', 'Admin']), async (req, res) => {
    const requestId = req.params.id;
    const { status, support_response } = req.body;
    const supportId = req.user.id;
    const role = req.user.role;

    // Validación básica
    if (!status && !support_response) {
        return res.status(400).json({ message: 'Debe proporcionar status o support_response.' });
    }

    try {
        let updateParts = [];
        let params = [];

        // Si se cambia el estado, asignamos el ticket al soporte si no está asignado
        if (status) {
            updateParts.push('status = ?');
            params.push(status);
            // Si el rol es Soporte y no hay support_id, lo asignamos
            if (role === 'Support') {
                updateParts.push('support_id = ?');
                params.push(supportId);
            }
        }

        if (support_response) {
            updateParts.push('support_response = ?');
            params.push(support_response);
        }

        if (updateParts.length === 0) {
            return res.status(400).json({ message: 'No hay campos válidos para actualizar.' });
        }

        const query = `UPDATE requests SET ${updateParts.join(', ')} WHERE id = ?`;
        params.push(requestId);

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }

        res.status(200).json({ message: 'Solicitud actualizada exitosamente.', requestId: requestId });

    } catch (error) {
        console.error('Error al actualizar solicitud:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar solicitud.' });
    }
});


module.exports = router;