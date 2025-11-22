const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

// Crear un pool de conexiones para manejo eficiente
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a MySQL!');
        connection.release(); // Devolver la conexión al pool
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error.message);
        // Si hay un error, el servidor no debería arrancar, podrías considerar salir.
        process.exit(1); 
    }
}

module.exports = {
    pool,
    testConnection
};