import express from 'express';
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import emailRouter from "./routes/email.routes.js";
import usersRouter from "./routes/users.routes.js";
import exphbs from "express-handlebars";
import {__dirname} from "./utils.js";
import viewRouter from "./routes/views.routes.js";
import mongoose from "mongoose";
import { config } from 'dotenv';
import jwtRouter from './routes/jwt.routes.js';
import { initializePassport } from './config/passport.config.js' ;
import passport from 'passport';
import cookieParser from 'cookie-parser';


config();


const app = express ();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connected Successfully'))
  .catch((err) => console.error('DB Connection Error: ', err));


//Para que nuestro servidor express pueda interpretar en forma automática mensajes de tipo JSON en formato urlencoded al recibirlos hay que agregar las siguientes 2 lineas 
app.use(express.json())
app.use (express.urlencoded({extended: true}));


// Creas una instancia de express-handlebars
const hbs = exphbs.create({
  // index.hbs
  extname: "hbs",
  // Plantilla principal
  defaultLayout: "main",
  helpers: {
    eq: function(a, b) {
      return a === b;
    },
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

// Configuras el engine
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);


//public- la carpeta que es acessible al cliente
app.use(express.static(`${__dirname}/public`));

// Inicialización de Passport
app.use(passport.initialize());

// Llamada a la función para inicializar las estrategias de Passport
initializePassport();
//
app.use(cookieParser());

//Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/email', emailRouter);
app.use('/api/users', usersRouter);
app.use('/api', jwtRouter);
app.use("/", viewRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); 

export default app;