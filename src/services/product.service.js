import productRepository from '../repositories/product.repository.js';
import productModel from '../dao/models/productModel.js';

class ProductService {
    async addProduct(data) {
    // Método para añadir un nuevo producto
        const { title, description, code, price, stock, category, thumbnails = [] } = data;
        if (!title || !description || !code || price == null || stock == null || !category) {
            throw new Error('Todos los campos son obligatorios, a excepción de thumbnails');
        }
        return await productRepository.addProduct({ title, description, code, price, stock, category, thumbnails });
    }

    async getProducts(queryParams) {
    // Método para obtener todos los productos
        const { limit = 10, page = 1, sort, query } = queryParams;
        const filter = query ? { category: query } : {};
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        
        const options = { page: Number(page), limit: Number(limit), sort: sortOption };
        return await productRepository.getProducts(filter, options);
    }

    async getProductDetails(id) {
    // Método para obtener los detalles de un producto
        const product = await productRepository.getProductById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async deleteProduct(id) {
    // Método para eliminar un producto
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID inválido');
        }
        const deletedProduct = await productRepository.removeProduct(id);
        if (!deletedProduct) {
            throw new Error('Producto no encontrado');
        }
        return deletedProduct;
    }

    async updateProductStock(productId, quantity) {
        const product = await productRepository.findById(productId); // Asegúrate de que este método esté definido
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        const newStock = product.stock - quantity;
        if (newStock < 0) {
            throw new Error('Stock insuficiente');
        }
        return await productRepository.updateProductStock(productId, newStock);
    }

    async getProductById(productId){
        try {
            const product = await productModel.findById(productId);
            return product;
        } catch (error) {
            throw new Error('Error al obtener el producto por ID');
        }
    }
}
export default new ProductService();
