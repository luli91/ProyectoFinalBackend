// rutas para renderizar las vistas
import { Router } from "express";
import passport from 'passport';
import { decodeToken } from "../utils.js";
import { obtenerDatos } from "../services/products.services.js";
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { getAllUsers } from '../controllers/user.controller.js';
import { PRIVATE_KEY } from '../utils.js'; 
import jwt from 'jsonwebtoken';


const router = Router();

//esto se muestra en la vista index.hbs, le paso un objeto
router.get('/', async (req, res) => {
  try {
    const productos = await obtenerDatos(req);
    // console.log(productos);
    res.render('products', {
      title: 'Ecommerce',
      user: req.user,
      products: productos.payload,
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('¡Algo salió mal!');
  }
});

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
  // console.log("Cookies: ", req.cookies);
  const token = req.cookies.jwtCookieToken;
  // console.log("Token from cookie:", token);
  const userFromToken = decodeToken(token);
  // console.log("User from token:", userFromToken);
  res.render("profile", {
      user: userFromToken.user,
      userIsLoggedIn: userFromToken.user.userIsLoggedIn,
  });
});

// Ruta para la vista de administrador
router.get('/admin', passport.authenticate("jwt", { session: false }), isAdmin, async (req, res) => {
  try {
    // console.log('Entrando a la ruta /admin');

    const token = req.cookies.jwtCookieToken;
    jwt.verify(token, PRIVATE_KEY, async (err, user) => {
        if (err) {
            return res.status(403).send({ error: "Token inválido o expirado" });
        }
        req.user = user;

        // console.log('Antes de llamar a getAllUsers');

        try {
            const users = await getAllUsers();
            // console.log('Usuarios obtenidos:', users);
            res.render('admin', {
              title: 'Panel de Administrador',
              user: user,
              users: users,
            });
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).send('¡Algo salió mal!');
        }
    });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).send('¡Algo salió mal!');
  }
});

router.get("/login", (req, res) => {
  res.render('login')
})

router.get("/register", (req, res) => {
  res.render('register')
})


export default router;