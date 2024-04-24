//importa los servicios
import productDao from '../daos/dbManager/product.dao.js';
import { crearDato, deleteServices } from '../services/products.services.js';



export const postDatosControllers = async (req, res) => {
    let dato = req.body;
    const result = await crearDato(dato);
    res.json(result)
}


export const getProductById = async (req, res) => {
    const { pid } = req.params;
    const product = await productDao.findById(pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
}

export const getProducts = async (req, res) => {
    const products = await productDao.findProduct({});
    const productsForView = products.docs.map(doc => doc.toObject());
    res.render('products', {
        user: req.session.user,
        products: productsForView
    });
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productDao.findById(id);
        if (req.user.role !== 'admin' && req.user._id !== product.owner) {
            return res.status(403).send('No tienes permiso para modificar este producto');
        }
        const post = await productDao.updateProduct(id, req.body);
        console.info(`Product updated: ${JSON.stringify(post)}`);
        res.json({
            post,
            message: "Product updated",
        });
    } catch (error) {
        console.error(error);
        res.json({
            error,
            message: "Error",
        });
    }
}


export const deleteDatosControllers = async (req, res) => {
    const { id } = req.params;
    if (req.user.user.role !== 'admin') {
        return res.status(403).send('No tienes permiso para eliminar este producto');
    }

    const deletedProduct = await productDao.delete(id);
    if (deletedProduct) {
        res.json({ status: 'Producto eliminado con éxito' });
    } else {
        res.status(500).json({ error: 'Hubo un error al eliminar el producto' });
    }
};




export const updateStockController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productDao.findById(id);
        // Verifica si el usuario tiene permiso para modificar el producto
        if (req.user.role !== 'admin' && req.user._id !== product.owner) {
            return res.status(403).send('No tienes permiso para modificar este producto');
        }
        // Actualiza el stock del producto con los datos proporcionados en req.body
        const updatedProduct = await productDao.updateProduct(id, req.body);
        lconsole.info(`Stock updated for product: ${JSON.stringify(updatedProduct)}`);
        res.json({
            updatedProduct,
            message: "Stock updated",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}