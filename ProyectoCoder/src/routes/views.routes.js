// rutas para renderizar las vistas
import { Router } from "express";

const router = Router();

//esto se muestra en la vista index.hbs, le paso un objeto
router.get("/", (req, res) => {
  res.render("index", {
    title: "Ecommerce",
    name: "Cyn",
    fileCss: "style.css",
  });
});

router.get("/products", (req, res) => {
  res.render("products", {
    title: "Productos",
    name: "Cyn",
    fileCss: "style.css",
  });
});


export default router;