import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { ownerShipMiddleware } from '../../middlewares/ownership.middleware.js';
import { isAdmin } from '../../middlewares/adminMiddleware.js';

// Carga las variables de entorno desde del archivo .env
dotenv.config();

// Accede a la clave secreta desde las variables de entorno
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// Mapea los nombres de las políticas a los middlewares correspondientes
const policies = {
    'OWNER': ownerShipMiddleware,
    'ADMIN': isAdmin,
    // Aquí puedes añadir más políticas si las necesitas
};
//esta clase extiende la funcionalidad del router de Express.js
export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    };

    getRouter() {
        return this.router;
    };
    init() { }; //Esta inicialilzacion se usa para las clases heredadas.

    get(path, policies, ...callbacks) {
        console.log("Entrando por GET a custom router con Path: " + path);
        console.log(policies);
        this.router.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks))
    }

    // POST
    post(path, policies, ...callbacks) {
        this.router.post(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks));
    };


    // PUT
    put(path, policies, ...callbacks) {
        this.router.put(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks));
    };


    // DELETE
    delete(path, policies, ...callbacks) {
        this.router.delete(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks));
    };

    handlePolicies = policyNames => (req, res, next) => {
        console.log("Politicas a evaluar:");
        console.log(policyNames);

        //Validar si tiene acceso publico:
        if (policyNames[0] === "PUBLIC") return next();

        //El JWT token se guarda en los headers de autorización.
        const authHeader = req.headers.authorization;
        console.log("Token present in header auth:");
        console.log(authHeader);

        if (!authHeader) {
            return res.status(401).send({ error: "User not authenticated or missing token." });
        }

        const token = authHeader.split(' ')[1]//Se hace el split para retirar la palabra Bearer.

        // Validamos token
        jwt.verify(token, PRIVATE_KEY, (error, credential) => {
            if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });

            // Token ok
            const user = credential.user
            console.log('Policies:', policies);
            console.log('User role:', user.role);
            // Preguntamos si dentro del array policies se encuentra el user.role que me esta llegando con este usuario
            if (policyNames.includes(user.role)) {
                const policyMiddleware = policies[user.role];
                return policyMiddleware(req, res, next);
            }
    
            return res.status(403).send({ error: "El usuario no tiene privilegios, revisa tus roles!" });
        })
    }


    generateCustomResponses = (req, res, next) => {
        //Custom responses 
        res.sendSuccess = payload => res.status(200).send({ status: "Success", payload });
        res.sendInternalServerError = error => res.status(500).send({ status: "Error", error });
        res.sendClientError = error => res.status(400).send({ status: "Client Error, Bad request from client.", error });
        res.sendUnauthorizedError = error => res.status(401).send({ error: "User not authenticated or missing token." });
        res.sendForbiddenError = error => res.status(403).send({ error: "Token invalid or user with no access, Unauthorized please check your roles!" });
        next()
    }


    // función que procese todas las funciones internas del router (middlewares y el callback principal)
    // Se explica en el slice 28
    applyCallbacks(callbacks) {
        return async (req, res, next) => {
            for (let i = 0; i < callbacks.length; i++) {
                try {
                    await callbacks[i].apply(this, [req, res, next]);
                } catch (error) {
                    console.error(error);
                    res.status(500).send(error);
                }
            }
        };
    };
    
};
