const jwt = require('jsonwebtoken');
require('dotenv').config();

// Obtiene la clave secreta del entorno para firmar/verificar JWT
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware 'protect': Verifica la validez del token JWT y autentica al usuario.
 * Se adjunta la información del usuario (payload) al objeto 'req'.
 */
const protect = (req, res, next) => {
    // 1. Obtener el token del encabezado (Authorization: Bearer <token>)
    let token;
    // Verifica si el encabezado existe y comienza con 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Extraer solo la parte del token
        token = req.headers.authorization.split(' ')[1]; 
    }

    if (!token) {
        // Si no hay token, acceso no autorizado
        return res.status(401).json({ message: 'Acceso denegado. No hay token proporcionado.' });
    }

    try {
        // 2. Verificar la firma del Token con la clave secreta
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Adjuntar el payload del usuario (id, role, etc.) a req.user para uso posterior
        req.user = decoded; 

        // Continuar con la ejecución del endpoint
        next(); 
    } catch (error) {
        // Si el token es inválido, manipulado o ha expirado
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

/**
 * Función 'authorizeRole': Genera un middleware que restringe el acceso a roles específicos.
 * @param {string|string[]} requiredRole - Un rol o un array de roles permitidos.
 */
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        // req.user fue establecido por el middleware 'protect'
        // Lógica: Verifica si el rol del usuario está incluido en los roles requeridos
        if (req.user && requiredRole.includes(req.user.role)) { 
            next(); // Rol autorizado
        } else {
            // Usuario autenticado, pero sin permisos para esta acción
            res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
        }
    };
};

module.exports = { protect, authorizeRole };