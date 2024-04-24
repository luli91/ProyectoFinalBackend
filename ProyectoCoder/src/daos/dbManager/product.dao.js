
import { productModel } from "../../models/product.model.js";

class ProductDao {
    

    async findById(pid) {
        return await productModel.findById(pid);
    }
    
    async findProduct(query, options) {
        return await productModel.paginate(query, options);
    }


    async createProduct(product) {
        return await productModel.create(product);
    }

    async updateProduct(_id, product) {
        return await productModel.findOneAndUpdate({ _id },product);
    }

    async delete(_id) {
        return await productModel.findByIdAndDelete(_id);
    }
    
    async getProducts({ limit, page }) {
        const query = {}; // define tu consulta aquí
        const options = {
            limit,
            page,
            sort: { createdAt: -1 }, // ordena los productos por fecha de creación
        };
        return await this.findProduct(query, options);
    }
}

export default new ProductDao();
