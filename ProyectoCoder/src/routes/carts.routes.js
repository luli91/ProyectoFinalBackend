import CustomRouter from '../routes/custom/custom.router.js';
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
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { ownerShipMiddleware } from '../middlewares/ownership.middleware.js'

const router = new CustomRouter();

// Rol user

// Crea un nuevo carrito
router.post('/', [ownerShipMiddleware], createCartController); 

// Obtiene un carrito por su ID
router.get('/:cid', [ownerShipMiddleware], getCartByIdController); 

// Actualiza solo la cantidad de un producto especifico en un carrito existente
router.put('/:cid/products/:pid', [ownerShipMiddleware], updateProductQuantityInCartController); 

// Añade un producto a un carrito
router.post('/:cid/products/:pid', [ownerShipMiddleware], addProductToCartController); 

// Elimina un producto de un carrito
router.delete('/:cid/products/:pid', [ownerShipMiddleware], removeProductFromCartController); 

// Realiza la compra de los productos en un carrito
router.post('/:cid/purchase', [ownerShipMiddleware], purchaseCartController); 


//Rol admin

//Actualiza un carrito existente
router.put('/:cid', [isAdmin], updateCartController);

// Elimina todos los productos de un carrito
router.delete('/:cid', [isAdmin], deleteWholeCartController); 

export default router.getRouter();
