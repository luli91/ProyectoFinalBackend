import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../utils.js'; 
import { cartService } from '../services/carts.services.js';
const { getCartById } = cartService;

export async function ownerShipMiddleware(req, res, next) {
    try {
    // token del usuario se envía en el encabezado de autorización
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, PRIVATE_KEY);

    // función que obtiene el carrito por id
    const carrito = await getCartById(req.params.cid);

    // Verifica si el usuario es el propietario del carrito
    if (carrito.userId !== decoded.userId) {
        return res.status(403).send({ error: 'No tienes permiso para acceder a este carrito' });
    }

    // Si el usuario es el propietario del carrito, continúa con el siguiente middleware
    next();
    } catch (error) {
        return res.status(500).send({ error: 'Ocurrió un error al verificar el propietario del carrito' });
    }
}
