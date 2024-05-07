import passport from 'passport';
import userModel from '../models/user.model.js';
import jwtStrategy from 'passport-jwt'
import { PRIVATE_KEY, createHash, isValidPassword } from '../utils.js';
import localStrategy from 'passport-local';
import {generateJWToken} from '../utils.js'

const  JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;


export const initializePassport = () => {
//estrategia para obtener el token por cookie
    passport.use('jwt' , new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) =>{
            console.info("Entrando a passport Strategy con JWT.");
            try{
                console.info("JWT obtenido del Payload");
                console.info(jwt_payload);
                return done(null, jwt_payload.user)
            }catch (error) {
                return done(error)
            }
        }
    ));

    // 

    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) =>{
            console.log("Ejecutando estrategia de registro");
            const { first_name, last_name, email, age } = req.body;
            try{
                const exist = await userModel.findOne ({ email });
                if (exist) {
                    console.info("El usuario ya existe!!");
                    done(null, false)
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role: req.body.role
                }
                const result = await userModel.create(user);
                return done (null, result)

            }catch (error) {
                return done("Error registrando al usuario" + error);
            }
        }
    ))

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                console.info("Usuario encontrado para login!");
                console.info(user);
    
                if (!user) {
                    console.warn("Usuario no existe con el nombre: " + username);
                    return done(null, false);
                }
    
                if (!isValidPassword(user, password)) {
                    console.warn("Credenciales invalidas para el usuario: " + username);
                    return done(null, false);
                }
    
                // Genera el token JWT para el usuario
                const tokenUser = {
                    id: user._id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    age: user.age,
                    role: user.role
                };
                const access_token = generateJWToken(tokenUser);
                console.info(access_token);
    
                // Devuelve el token JWT en lugar del objeto de usuario
                return done(null, access_token);
            } catch (error) {
                return done(error);
            }
        })
    );
}    
const cookieExtractor = req =>{
    let token = null;
    console.info("entrando a Cookie Extractor");
    if (req && req.cookies){
    console.info("cookie presente: ");
    console.info(req.cookies);
    token = req.cookies['jwtCookieToken'];
    }
    return token;
};

export const passportCall = (strategy) => {
    return passport.authenticate(strategy);
};
