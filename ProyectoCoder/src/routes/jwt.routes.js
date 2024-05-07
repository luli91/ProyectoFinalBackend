import { Router } from 'express';
import userModel from '../models/user.model.js';
import passport from 'passport';
import { isValidPassword } from '../utils.js';
import { generateJWToken } from '../utils.js';


const router = Router();

router.post("/login",passport.authenticate('login', { session: false }), async (req, res) => {
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

        // Actualiza la última conexión del usuario
        user.lastConnection = Date.now();
        await user.save();
        
        const tokenUser = {
            id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
            userIsLoggedIn: true,
        };
        const access_token = generateJWToken(tokenUser);
        console.info(access_token);
    
        //guardo el token en una Cookie
        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 3600000,
                httpOnly: true,
            }
        )
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }

});

// Register
router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
    console.log("Datos de la petición:", req.body);
    
    res.redirect('/profile');
})

router.get('/logout', (req, res) => {
    res.clearCookie('jwtCookieToken');
    res.send({ message: "Logout success!!" });
});

export default router;
