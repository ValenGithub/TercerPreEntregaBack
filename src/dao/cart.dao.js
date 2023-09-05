import { cartModel } from '../models/cartModel.js';
import productModel from '../models/productModel.js';

class cartDao {
	constructor() {
		this.model = cartModel;
	}

	async agregarCarrito() {
		const cart = await this.model.create({ products: [] });
		console.log(cart)
		return cart
	}

	async obtenerCarritos() {
		return await this.model.find().lean();
	}

	async obtenerCarritoById(cartId){
		return await this.model.findById(cartId).populate('products.product').lean();
	}


	async agregarProductoCarrito(cid,pid) {
		try {
			const cart = await this.model.findById(cid);
			if (!cart) {
			  throw new Error("No existe el carrito buscado");
			}
	  
			const product = await productModel.findById(pid);
	  
			if (!product) {
			  throw new Error("No existe el producto buscado");
			}
	  
			const index = cart.products.findIndex((producto) => {
			  return producto.product.toString() === pid;
			});
	  
			if (index === -1) {
			  cart.products.push({ product: pid, quantity: 1 });
			} else {
			  cart.products[index].quantity += 1;
			}
	  
			await cart.save();
			return cart;
		  } catch (error) {
			throw new Error(`No se pudo agregar producto al carrito: ${error}`);
		  }
	}

	async vaciarCarrito(cartId) {
		const carrito = await this.model.findOne({ _id: cartId });
		
		carrito.products = [];
		
		return await carrito.save();
	}

	async eliminarProductoDeCarrito(cartId, prodId) {
		const carrito = await this.model.findOne({ _id: cartId });
  
		// Buscar el producto en el arreglo de productos del carrito
		const producto = carrito.products.find(
		  (item) => item.product.toString() === prodId
		);
		
		if (producto) {
		  // Si se encuentra el producto, restar la cantidad en 1
		  if (producto.quantity > 1) {
			producto.quantity -= 1;
		  } else {
			// Si la cantidad es 1, eliminar el producto del arreglo
			carrito.products = carrito.products.filter(
			  (item) => item.product.toString() !== prodId
			);
		  }
		  return await carrito.save();
		}
		return carrito;
		
	}

	async actualizarCantidadProductoCarrito(cartId, prodId, newQuantity) {
		const carrito = await this.model.findOne({ _id: cartId });
		
		// Buscar el producto en el arreglo de productos del carrito
		const producto = carrito.products.find(
		  (item) => item.product.toString() === prodId
		);
		
		if (producto) {
		  // Actualizar la cantidad del producto
		  producto.quantity = newQuantity;
		  return await carrito.save();
		} else {
		  // Si no se encuentra el producto, no se realiza ninguna acción
		  return carrito;
		}
	}

	async actualizarArrayCarrito(cartId, nuevosProductos) {
		const carrito = await this.model.findOne({ _id: cartId });
	  
		nuevosProductos.forEach(async (nuevoProducto) => {
		  const { product, quantity } = nuevoProducto;
		  const productoExistente = carrito.products.find(
			(item) => item.product.toString() === product
		  );
	  
		  if (productoExistente) {
			productoExistente.quantity += quantity;
		  } else {
			carrito.products.push({
			  product: product,
			  quantity: quantity
			});
		  }
		});
	  
		await carrito.save();
		return carrito;
	}
}

const CartDao = new cartDao();
export default CartDao;