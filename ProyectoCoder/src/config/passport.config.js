import passport from 'passport';
import userModel from '../models/user.model.js';
import GitHubStrategy from 'passport-github2';
import jwtStrategy from 'passport-jwt'
import { PRIVATE_KEY, createHash, isValidPassword } from '../utils.js';
import localStrategy from 'passport-local';


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

    //usando Github para loguearse
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.6e9373c7f6fea2b6',
            clientSecret: '7e2c59f85c9e7d5abae6f8ab38b597a4a8d56c5e',
            callbackUrl: 'http://localhost:5000/api/sessions/githubcallback',
        },
        async (accessToken, refreshToken, profile, done) => {
            console.info("Perfil obtenido del usuario de GitHub ");
            console.info(profile);
            try {
                //Validamos si el user existe en la DB
                const user = await userModel.findOne({ email: profile._json.email });
                console.info("Usuario encontrado para login:");
                console.info(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 28,
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub"
                    }
                    const result = await userModel.create(newUser);
                    return done(null, result)
                } else {
                    // Si entramos por aca significa que el user ya existe en la DB
                    return done(null, user)
                }

            } catch (error) {
                return done(error)
            }
        }
    ))

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
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

};
const cookieExtractor = req =>{
    let token = null;
    console.info("entrando a Cookie Extractor");
    if (req && req.cookies){
    console.info("cookie presente: ");
    console.info(req.cookies);
    token = req.cookie('jwtCookieToken')
    }
    return token;
};

export const passportCall = (strategy) => {
    return passport.authenticate(strategy);
};
  // //Funciones de Serializacion y Deserializacion
    // passport.serializeUser((user, done) => {
    //     done(null, user._id)
    // })

    // passport.deserializeUser(async (id, done) => {
    //     try {
    //         let user = await userModel.findById(id);
    //         done(null, user)
    //     } catch (error) {
    //         console.error("Error deserializando el usuario: " + error);
    //     }
    // });

    // passport.serializeUser((user, done) => {...}): Esta función se utiliza para serializar el usuario, es decir, para guardar la información del usuario en la sesión. En tu caso, estás guardando el _id del usuario en la sesión. 
    // passport.deserializeUser(async (id, done) => {...}): Esta función se utiliza para deserializar el usuario, es decir, para recuperar los datos del usuario de la sesión utilizando el _id que se guardó durante la serialización.