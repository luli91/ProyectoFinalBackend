import express from 'express';
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
// import emailRouter from "./routes/email.routes.js";
import usersRouter from "./routes/users.routes.js";
import handlebars from "express-handlebars";
import {__dirname} from "./utils.js";
import viewRouter from "./routes/views.routes.js";
import mongoose from "mongoose";
import { config } from 'dotenv';
import jwtRouter from './routes/jwt.routes.js';
import { initializePassport } from './config/passport.config.js' ;
import passport from 'passport';
import session from 'express-session';



config();


const app = express ();
const PORT = 8080;
//Para que nuestro servidor express pueda interpretar en forma automática mensajes de tipo JSON en formato urlencoded al recibirlos hay que agregar las siguientes 2 lineas 
app.use(express.json())
app.use (express.urlencoded({extended: true}));

const password = process.env.DB_PASSWORD; 
const dbName = process.env.DB_NAME; 

// Mongoose connection
mongoose
  .connect(
    `mongodb+srv://cynthiamedina1808:${password}@proyectofinal.kwov5cd.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=proyectofinal`
  )
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Hubo un error");
    console.log(err);
  });

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

// Configuramos el engine
app.engine(
    "hbs",
    handlebars.engine({
      // index.hbs
        extname: "hbs",
      // Plantilla principal
        defaultLayout: "main",
    })
);

  // Seteamos nuestro motor
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

//public- la carpeta que es acessible al cliente
app.use(express.static(`${__dirname}/public`));

// Inicialización de Passport
app.use(passport.initialize());

// Llamada a la función para inicializar las estrategias de Passport
initializePassport();

//Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
// app.use('/api/email', emailRouter);
app.use('/api/users', usersRouter);
app.use('/api', jwtRouter);

app.use("/", viewRouter);


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));