import { Router } from 'express';
import userModel from '../models/user.model.js';
import passport from 'passport';
import { isValidPassword } from '../utils.js';
import { generateJWToken } from '../utils.js';


const router = Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate('github', { session: false, failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;

    // conJWT 
    const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    };
    const access_token = generateJWToken(tokenUser);
console.info(access_token);

    res.cookie('jwtCookieToken', access_token,
        {
            maxAge: 60000,
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie

        }

    )
    res.redirect("/users");

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        console.info("Usuario encontrado para login:");
        console.info(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.info(access_token);
    
        //guardo el token en una Cookie
        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 60000,

            }

        )
        res.send({ message: "Login success!!" })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }

});

// Register
router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
    console.log("Datos de la petición:", req.body);
    res.status(201).send({ status: "success", message: "Usuario creado con exito.", userId: req.user._id });
})

router.get('/logout', (req, res) => {
    res.clearCookie('jwtCookieToken');
    res.send({ message: "Logout success!!" });
});


router.get('/api/sessions/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user);
});

// Ruta para solicitar el restablecimiento de la contraseña
router.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;
    // Busca al usuario en la base de datos
    const user = await userModel.findOne({ email: email });
    if (!user) {
        logger.warn("User doesn't exists with username: " + email);
        return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
    }
    // Genera un token único que caduca después de una hora
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Enviar correo electrónico con el link para restablecer la contraseña
    const html = `Para restablecer tu contraseña, haz clic en este enlace: ${process.env.CLIENT_URL}/resetPassword/${token}`;
    sendEmail(email, 'Restablecer contraseña', html, res);
    });

  // Ruta para restablecer la contraseña
router.post("/resetPassword/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    // Verifica el token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
        // El token es inválido o ha expirado
        return res.status(401).send('Enlace inválido o expirado');
        } else {
        // Busca al usuario en la base de datos
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        // Asegurate de que la nueva contraseña no sea la misma que la anterior
        if (isValidPassword(user, newPassword)) {
            return res.status(400).send('La nueva contraseña no puede ser la misma que la antigua');
        }
        // Actualiza la contraseña del usuario
        user.password = createHash(newPassword);
        await user.save();
        res.send('Contraseña actualizada con éxito');
        }
    });
});

router.put('/api/users/premium/:uid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { uid } = req.params;
    const user = await userModel.findById(uid);
    if (!user) {
        return res.status(404).send('Usuario no encontrado');
    }
    user.role = user.role === 'user' ? 'premium' : 'user';
    await user.save();
    res.send('Rol de usuario actualizado con éxito');
    });


export default router;