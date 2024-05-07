import { Router } from "express";
import { 
    createCartController, 
    getCartByIdController, 
    updateCartController, 
    addProductToCartController, 
    removeProductFromCartController, 
    deleteWholeCartController, 
    purchaseCartController,
    updateProductQuantityInCartController,
} from '../controllers/carts.controller.js';
// import { isAdmin } from '../middlewares/adminMiddleware.js';
// import { ownerShipMiddleware } from '../middlewares/ownership.middleware.js'
import { verifyJWT } from "../utils.js";


const router = Router();

// Rol user

// Crea un nuevo carrito
router.post('/', verifyJWT, createCartController); 

// Obtiene un carrito por su ID
router.get('/:cid', getCartByIdController); 

// Actualiza solo la cantidad de un producto especifico en un carrito existente
router.put('/:cid/products/:pid', updateProductQuantityInCartController); 

// Añade un producto a un carrito
router.post('/:cid/products/:pid', addProductToCartController); 

// Elimina un producto de un carrito
router.delete('/:cid/products/:pid', removeProductFromCartController); 

// Realiza la compra de los productos en un carrito
router.post('/:cid/purchase', purchaseCartController); 


//Rol admin

//Actualiza un carrito existente
router.put('/:cid', updateCartController);

// Elimina todos los productos de un carrito
router.delete('/:cid', deleteWholeCartController); 

export default router;