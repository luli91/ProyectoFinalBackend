//importa los servicios
import productDao from '../daos/dbManager/product.dao.js';
import { crearDato, obtenerDatos } from '../services/products.services.js';



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

// Esta función obtiene los productos y los envía como una respuesta JSON
export const getProducts = async (req, res) => {
    try {
        const products = await obtenerProductos(req);
        // console.log('Enviando productos:', products);
        res.json(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('¡Algo salió mal!');
    }
};

// Esta función solo obtiene los productos
export const obtenerProductos = async (req) => {
    const products = await obtenerDatos(req);
    // console.log('Productos desde obtenerDatos:', products);
    if (products && products.payload) {
        return products.payload;
    } else {
        throw new Error('No se encontraron productos');
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productDao.findById(id);
        if (req.user.role !== 'admin' && req.user._id !== product.owner) {
            return res.status(403).send('No tienes permiso para modificar este producto');
        }
        // Validación de datos
        if (!req.body.title || !req.body.description || !req.body.price || !req.body.thumbnail || !req.body.code || !req.body.stock) {
            throw new Error('Faltan datos requeridos');
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