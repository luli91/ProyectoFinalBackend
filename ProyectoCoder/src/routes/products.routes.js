import { Router } from 'express';
//importar controller 
import { postDatosControllers, deleteDatosControllers, getProductById, getProducts, updateProduct } from '../controllers/products.controller.js'
const router = Router();
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { verifyJWT } from '../utils.js';


// Rutas accesibles para los clientes
router.get('/products', getProducts); // Obtener todos los productos
router.get('/:pid', getProductById); // Obtener un producto específico por su ID

// Rutas accesibles solo para los administradores
router.post("/", verifyJWT, isAdmin, postDatosControllers);
 // Agregar un nuevo producto
router.put("/:id", verifyJWT, isAdmin, updateProduct); // Actualizar un producto existente
router.delete("/:id", verifyJWT, isAdmin, deleteDatosControllers ); // Eliminar un producto existente

export default router;
