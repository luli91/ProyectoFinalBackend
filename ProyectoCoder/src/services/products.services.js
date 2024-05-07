import productDao from '../daos/dbManager/product.dao.js';


export const obtenerDatos = async (req) => {
    //logica de negocio
        let { limit, page, sort, category, maxPrice, productName } = req.query;

        // Establece valores predeterminados
        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;
        sort = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

        // Crea el objeto de consulta
        let query = {};
        if (category) {
            query.category = category;
        }
        if (maxPrice) {
            query.price = { $lte: maxPrice };
        }
        if (productName) {
            query.title = productName;
        }

        // Crea el objeto de opciones para paginate
        const options = {
            page,
            limit,
            sort
        };

        // Realiza la consulta con los parámetros
        const result = await productDao.findProduct(query, options);

 // Convierte los documentos de Mongoose a objetos JavaScript
        const products = result.docs.map(doc => doc.toObject());

        // Crea el objeto de respuesta
        const response = {
            status: 'success',
            payload: products,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}&limit=${limit}` : null
        };

        return response;
    }

    export const crearDato = async (dato) => {
        // Validación de datos
    if (!dato.title || !dato.description || !dato.price || !dato.thumbnail || !dato.code || !dato.stock) {
        throw new Error('Faltan datos requeridos');
    }

    // Creación del producto
        const products = await productDao.createProduct(dato);
    
        return {
            products,
            message: "Product created",
        };
    }
    export const deleteServices = async (req) => {
        const { id } = req.params;
        const products = await productDao.delete(id);
    
        return {
            products,
            message: "Product deleted",
        };
    }