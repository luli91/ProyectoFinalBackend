import { cartService } from '../services/carts.services.js';


//Crea un nuevo carrito para un usuario.
export const createCartController = async (req, res) => {
    // Obtiene el userID del token decodificado
    const userID = req.user.id;
    const newCart = await cartService.createCart(userID);
    res.status(201).json(newCart);
};


//Obtiene un carrito por su ID.
export const getCartByIdController = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartService.getCartById(cartId);
    res.json(cart);
};


// Actualiza un carrito existente con un nuevo array de productos.
export const updateCartController = async (req, res) => {
    const { cid } = req.params;
    const cart = req.body; // req.body es el nuevo array de productos
    const respuesta = await cartService.updateCart(cid, cart);
    res.json({ status: 'Carrito actualizado', cart: respuesta });
};


//Añade un producto a un carrito existente.
export const addProductToCartController = async (req, res) => {
    const cartID = req.params.cid;
    const productID = req.params.pid;
    const product = { product: productID, quantity: 1 };
    const updatedCart = await cartService.addProductToCart(cartID, product);
    res.status(200).json(updatedCart);
};

// Elimina un producto de un carrito
export const removeProductFromCartController = async (req, res) => {
    const { cid, pid } = req.params;
    const respuesta = await cartService.removeProductFromCart(cid, pid);
    res.json({ status: 'Producto eliminado del carrito' });
};

//Elimina todos los productos de un carrito
export const deleteWholeCartController = async (req, res) => {
    const { cid } = req.params;
    const respuesta = await cartService.deleteWholeCart(cid);
    res.json({ status: 'Todos los productos eliminados del carrito' });
};

//purchaseCartController
export const purchaseCartController = async (req, res) => {
    const cartId = req.params.cid;
    const productsFromCart = await getProductsFromCartById(cartId);
    const { validProducts, invalidProducts } = evaluateStock(productsFromCart);
    let grandTotal = 0;
    for (const product of validProducts) {
        grandTotal += product.productId.price * product.quantity;
        const reqs = { cid: cartId, pid: product.productId };
        await deleteProductFromCartByIdController(reqs, res);
    }
    if (validProducts.length > 0) {
        const ticket = { amount: grandTotal, purchaser: req.session.user.username };
        const createdTicket = await createTicket(ticket, res);
    }
};

function evaluateStock(productsFromCart) {
    const validProducts = [];
    const invalidProducts = [];
    productsFromCart.forEach((product) => {
        if (product.quantity <= product.productId.stock) {
            validProducts.push(product);
        } else {
            invalidProducts.push(product);
        }
    });
    return { validProducts, invalidProducts };
}

async function getProductsFromCartById(cartId) {
    const cart = await cartService.getCartById(cartId);
    return cart.products;
}

export const updateProductQuantityInCartController = async (req, res) => {
    const cartID = req.params.cid;
    const productID = req.params.pid;
    const quantity = req.body.quantity;
    const product = { product: productID, quantity: quantity };
    const updatedCart = await cartService.updateProductQuantityInCart(cartID, product);
    res.status(200).json(updatedCart);
};
