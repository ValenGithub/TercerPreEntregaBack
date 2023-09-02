import  productModel  from '../models/productModel.js';

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
		  throw new Error('Error al obtener los productos');
		}
	  }

	async agregarProducto(product) {
		if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock ) {
			throw new Error('Faltan campos');
		}
		return await this.model.create(product);
	}

    async obtenerProductoById(prodId) {
		return await this.model.findById(prodId);
	  }

	async actualizarProducto(pid, product) {
		if (!pid) {
			throw new Error('Ingrese el id del producto a actualizar');
		}
		return await this.model.updateOne({ _id: pid }, product);
	}

	async eliminarProducto(pid) {
        if (!pid) {
			throw new Error('Ingrese el id del producto a eliminar');
		}
		return this.model.deleteOne({ _id: pid });
	}
}

const productDao = new ProductDao();
export default productDao;