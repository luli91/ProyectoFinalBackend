import { cartModel } from "../../models/cart.model.js";

class cartDao {
    //devuelve todos los carritos en la base de datos
    async findCarts() {
        return await cartModel.find();
    }
    //devuelve un carrito específico por su ID. Utiliza el método populate para rellenar los detalles del producto en el carrito
    async getCartById(_id) {
        return await cartModel.findById(_id).populate('products.product');
    }
    //crea un nuevo carrito en la base de datos
    async createCart(cart) {
        return await cartModel.create(cart);
    }
    //actualiza un carrito existente en la base de datos
    async updateCart(_id, cart) {
        return await cartModel.findByIdAndUpdate(_id, {products: cart});
    }
    //agrega un producto a un carrito existente. Si el producto ya está en el carrito, aumenta la cantidad. Si no, lo agrega al carrito
    async addProductToCart(_id, product) {
        const cart = await this.getCartById(_id);
        if (!cart) {
            console.error("Carrito no encontrado");
            return;
        }
    
        const productInCart = cart.products.findIndex(p => p.product._id.toString() === product.product);
    
        if (productInCart !== -1) {
            // si el producto ya está en el carrito, aumento la cantidad
            cart.products[productInCart].quantity += product.quantity;
        } else {
            // si el producto no está en el carrito, lo agrego
            cart.products.push(product);
        }
    
        return await this.updateCart(_id, cart.products);
    }
    
    //este método podría disminuir la cantidad de un producto en el carrito o eliminarlo completamente si la cantidad es 1.
    async removeProductFromCart(_id, product) {
        const cart = await this.getCartById(_id);
        if (!cart) {
            console.error("Carrito no encontrado");
            return;
        }

        const productIndex = cart.products.findIndex((p) => p.product._id.toString() === product.product);
        if (productIndex !== -1) {
            // Si el producto está en el carrito, disminuir la cantidad o eliminarlo
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity--;
            } else {
                cart.products.splice(productIndex, 1);
            }
        }

        return await this.updateCart(_id, cart.products);
    }
//este método podria calcular el total del carrito sumando el precio de cada producto multiplicado por su cantidad.
    async getCartTotal(_id) {
        const cart = await this.getCartById(_id);
        if (!cart) {
            console.error("Carrito no encontrado");
            return;
        }

        let total = 0;
        for (const item of cart.products) {
            const product = await productModel.findById(item.product);
            total += product.price * item.quantity;
        }

        return total;
    }

    //devuelve un carrito por el ID del usuario
    async getCartByUserId(userId) {
        return await cartModel.findOne({ userId: userId });
    }
    
    async updateProductQuantityInCart(_id, product) {
        const cart = await this.getCartById(_id);
        if (!cart) {
            logger.error("Carrito no encontrado");
            return;
        }

        const productInCart = cart.products.findIndex(p => p.product._id.toString() === product.product);

        if (productInCart !== -1) {
            // si el producto ya está en el carrito, actualizo la cantidad
            cart.products[productInCart].quantity = product.quantity;
        } else {
            // si el producto no está en el carrito, lo agrego
            cart.products.push(product);
        }

        return await this.updateCart(_id, cart.products);
    }
}

export default new cartDao();



