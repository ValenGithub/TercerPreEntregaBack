import  productModel  from '../models/productModel.js';
import CustomErrors from '../utils/customErrors.js';
import { generateErrorProduct } from '../utils/info.js';
import EErrors from '../utils/EErrors.js';

class ProductDao {
	constructor(io) {
		this.model = productModel;
		this.io = io;
	}

	async obtenerProductos() {
		return await this.model.find().lean();
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
		  console.error(error);
		  CustomErrors.createError('Error al obtener los productos', generateErrorProduct({ err }), 'Not get', EErrors.PRODUCT_ERROR)
		}
	  }

	async agregarProducto(product) {
		try {

			if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.owner) {
				throw new Error('Faltan campos');
			}
			return await this.model.create(product);
		} catch {
			CustomErrors.createError('Error al agregar el producto', generateErrorProduct({ err }), 'Not add', EErrors.PRODUCT_ERROR)
		}
	}

    async obtenerProductoById(prodId) {
		try {

			return await this.model.findById(prodId);
		} catch{
			CustomErrors.createError('Error al obtener el producto', generateErrorProduct({ err }), 'Not get', EErrors.PRODUCT_ERROR)
		}
	  }

	async actualizarProducto(pid, product) {
		try {

			if (!pid) {
				throw new Error('Ingrese el id del producto a actualizar');
			}
			return await this.model.updateOne({ _id: pid }, product);
		} catch {
			CustomErrors.createError('Error al actualizara el producto', generateErrorProduct({ err }), 'Not update', EErrors.PRODUCT_ERROR)
		}
	}

	async eliminarProducto(pid) {
		try {

			if (!pid) {
				throw new Error('Ingrese el id del producto a eliminar');
			}
			return this.model.deleteOne({ _id: pid });
		} catch {
			CustomErrors.createError('Error al agregar eliminar el producto', generateErrorProduct({ err }), 'Not delete', EErrors.PRODUCT_ERROR)
		}
	}
}

const productDao = new ProductDao();
export default productDao;