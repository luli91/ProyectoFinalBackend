import cartDao  from '../daos/dbManager/cart.dao.js';
import productDao from '../daos/dbManager/product.dao.js';

// // Función para generar un código único para ticket por ahora no la uso
// const generateUniqueCode = () => {
//     return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// }

// Función para calcular el total del carrito
const calculateTotal = (cart) => {
    return cart.products.reduce((total, product) => total + product.price * product.quantity, 0);
}

export const cartService = {
    createCart: async (cartData) => {
        return await cartDao.createCart(cartData);
    },

    getCartById: async (_id) => {
        return await cartDao.getCartById(_id);
    },

    updateCart: async (_id, cart) => {
        return await cartDao.updateCart(_id, {products: cart});
    },

    addProductToCart: async (cid, pid) => {
        return await cartDao.addProductToCart(cid, pid);
    },

    getCartByUserId: async (cid) => {
        return await cartDao.getCartByUserId(cid);
    },

    removeProductFromCart: async (cid, pid) => {
        return await cartDao.removeProductFromCart(cid, { product: pid });
    },

    deleteWholeCart: async (cid) => {
        return await cartDao.updateCart(cid, { products: [] });
    },

    purchaseCart: async (cid) => {
        const cart = await cartDao.getCartById(cid);
        const productsNotPurchased = []; // Arreglo para almacenar los IDs de productos no procesados

        // Iterar sobre cada producto en el carrito
        for (const item of cart.items) {
            const product = await productDao.findById(item.productId);

            // Verificar si hay suficiente stock
            if (product.stock < item.quantity) {
                productsNotPurchased.push(item.productId);
            } else {
                // Restar la cantidad comprada del stock del producto
                product.stock -= item.quantity;
                await productDao.updateProduct(product);
            }
        }

        // Calcular el total del carrito
        const total = calculateTotal(cart);

        // Filtrar el carrito para contener solo los productos no comprados
        const filteredItems = cart.items.filter(item => !productsNotPurchased.includes(item.productId));
        cart.items = filteredItems;
        await cartDao.updateCart(cart);

        return {
            success: true,
            total: total, // Devolver el total del carrito
            productsNotPurchased: productsNotPurchased, // Devolver los IDs de productos no procesados
        };
    },
};
