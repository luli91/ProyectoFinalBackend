import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../utils.js'; 


export async function isAdmin(req, res, next) {
    try {
        // token del usuario se envía en el encabezado de autorización
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1]; // Aquí se obtiene el token sin el prefijo 'Bearer '

        // console.log('Token recibido:', token);
        // console.log('req.user:', req.user);

        const decoded = jwt.verify(token, PRIVATE_KEY);
        // console.log('Token decodificado:', decoded);
        // Verifica si el usuario es administrador
        // console.log('decoded.role:', decoded.user.role);
        if (decoded.user.role !== 'admin') {
            return res.status(403).send({ error: 'No tienes permiso para realizar esta acción' });
        }

        // Si el usuario es administrador, continúa con el siguiente middleware
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error); 
        return res.status(500).send({ error: 'Ocurrió un error al verificar el rol del usuario' });
    }
}
