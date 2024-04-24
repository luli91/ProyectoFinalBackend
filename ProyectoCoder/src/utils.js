import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs'; 
import passport from 'passport';

// Carga las variables de entorno desde tu archivo .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Accede a la clave secreta desde las variables de entorno
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// console.log('PRIVATE_KEY:', PRIVATE_KEY); 
// Función para generar un nuevo token JWT para un usuario
export const generateJWToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
}

// Middleware para verificar   el token JWT en las solicitudes entrantes
export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (err, user) => {
        if (err) {
        return res.status(403).send({ error: "Token inválido o expirado" });
        }
        req.user = user;
        next();
    });
} else {
    res.status(401).send({ error: "Acceso denegado, token no proporcionado" });
    }
}
// Función para crear un hash de la contraseña
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Función para validar la contraseña
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

// Función para llamar a una estrategia de Passport.js
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};

// Función para verificar la autorización basada en roles
export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT")
        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next()
    }
};

export { __dirname, PRIVATE_KEY };
