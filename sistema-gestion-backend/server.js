const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./db');
const authRoutes = require('./routes/auth.routes');
const requestRoutes = require('./routes/requests.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors()); // Permite peticiones desde el frontend (Angular)
app.use(express.json()); // Permite a Express leer JSON en el body de las peticiones

// INTEGRAR RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

// Rutas de prueba (Endpoint principal)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API de Gestión de Solicitudes funcionando' });
});

// Arrancar el servidor
async function startServer() {
    // 1. Probar la conexión a la base de datos
    await testConnection();

    // 2. Iniciar Express
    app.listen(PORT, () => {
        console.log(`📡 Servidor Express escuchando en http://localhost:${PORT}`);
    });
}

startServer();