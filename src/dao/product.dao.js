import productModel from '../models/productModel.js';
import CustomErrors from '../utils/customErrors.js';
import { generateErrorProduct } from '../utils/info.js';
import EErrors from '../utils/EErrors.js';
import { logger } from '../middlewares/logger.middleware.js';
import userDao from './user.dao.js';

class ProductDao {
    constructor(io) {
        this.model = productModel;
        this.io = io;
    }

    async obtenerProductos() {
        try {
            return await this.model.find().lean();
        } catch (error) {
            logger.error(error);
            CustomErrors.createError('Error al obtener los productos', generateErrorProduct({ error }), 'Not get', EErrors.PRODUCT_ERROR);
        }
    }

    async obtenerProductosPaginados(limit = 10, page = 1, sort = 'asc', query = 'all') {
        try {
            const filter = {};
            if (query === 'true') {
                filter.stock = { $gt: 0 };
            } else if (query === 'false') {
                filter.stock = { $lte: 0 };
            }
            const options = {
                lean: true,
                page,
                limit,
                sort: { price: sort === 'desc' ? -1 : 1 },
            };

            const result = await this.model.paginate(filter, options);
            return result;
        } catch (error) {
            logger.error(error);
            CustomErrors.createError('Error al obtener los productos paginados', generateErrorProduct({ error }), 'Not get', EErrors.PRODUCT_ERROR);
        }
    }

	async agregarProducto(product) {
		try {
			
			if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.owner) {
				throw new Error('Faltan campos');
			}
	
			
			const user = await userDao.getByEmail(product.owner);
	
			if (!user) {
				throw new Error('Usuario no encontrado.');
			}
			if (user.rol !== 'PREMIUM' && user.rol !== 'ADMIN') { 
				throw new Error('Solo los usuarios premium pueden ser dueños de un producto.');
			}

			product.owner = user._id; 
			return await this.model.create(product);
		} catch (error) {
			logger.error(error);
			CustomErrors.createError('Error al agregar el producto', generateErrorProduct({ error }), 'Not add', EErrors.PRODUCT_ERROR);
		}
	}

    async obtenerProductoById(prodId) {
        try {
            return await this.model.findById(prodId);
        } catch (error) {
            logger.error(error);
            CustomErrors.createError('Error al obtener el producto por ID', generateErrorProduct({ error }), 'Not get', EErrors.PRODUCT_ERROR);
        }
    }

    async actualizarProducto(pid, product) {
        try {
            if (!pid) {
                throw new Error('Ingrese el id del producto a actualizar');
            }
            return await this.model.updateOne({ _id: pid }, product);
        } catch (error) {
            logger.error(error);
            CustomErrors.createError('Error al actualizar el producto', generateErrorProduct({ error }), 'Not update', EErrors.PRODUCT_ERROR);
        }
    }

    async eliminarProducto(pid) {
        try {
            if (!pid) {
                throw new Error('Ingrese el id del producto a eliminar');
            }
            return await this.model.deleteOne({ _id: pid });
        } catch (error) {
            logger.error(error);
            CustomErrors.createError('Error al eliminar el producto', generateErrorProduct({ error }), 'Not delete', EErrors.PRODUCT_ERROR);
        }
    }
}

const productDao = new ProductDao();
export default productDao;