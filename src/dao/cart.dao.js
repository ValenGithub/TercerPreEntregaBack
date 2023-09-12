import { cartModel } from '../models/cartModel.js';
import productModel from '../models/productModel.js';
import CustomErrors from '../utils/customErrors.js';
import { generateErrorCart } from '../utils/info.js';
import EErrors from '../utils/EErrors.js';

class cartDao {
	constructor() {
		this.model = cartModel;
	}

	async agregarCarrito() {
		try {
            const cart = await this.model.create({ products: [] });
            return cart;
        } catch (err) {
            CustomErrors.createError('Problemas al crear un cart', generateErrorCart({ err }), 'Error create cart', EErrors.CART_ERROR)
        }
	}

	async obtenerCarritos() {
		try {
			return await this.model.find().lean();

		}catch{
			CustomErrors.createError('Problemas al conseguir los carritos', generateErrorCart({ err }), 'Error cart ID', EErrors.CART_ERROR)
		}
	}

	async obtenerCarritoById(cartId){
		try {
            return await this.model.findById(cartId).populate('products.product').lean();
        } catch (err) {
            CustomErrors.createError('Problemas al conseguir id cart', generateErrorCart({ err }), 'Error cart ID', EErrors.CART_ERROR)
        }

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
			CustomErrors.createError('Problemas para agregar producto al carrito', generateErrorCart({err}), 'Error al agregar',EErrors.CART_ERROR)
		  }
	}

	async vaciarCarrito(cartId) {
		try {
            const cart = await this.model.deleteOne({ _id: cartId });
            return cart;
        } catch (err) {
            CustomErrors.createError('Error vaciar carrito', generateErrorCart({ err }), 'Error clean Cart', EErrors.CART_ERROR)
        }
	}

	async eliminarProductoDeCarrito(cartId, prodId) {
		try {
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
			
        } catch (err) {
            CustomErrors.createError('Probl en eliminar pid del cid', generateErrorCart({ err }), 'Error cart,  product delete ', EErrors.CART_ERROR)
        }
		
	}

	async actualizarCantidadProductoCarrito(cartId, prodId, newQuantity) {
		try {
            const cart = await this.cart.findOne({ _id: cartId });
            const product = cart.products.find((product) => product._id == prodId);
            if (!product) {
                throw new Error('No se encontró el producto en el carrito');
            }
            product.quantity = newQuantity;

            await cart.save();
            return cart;
        } catch (err) {
            CustomErrors.createError('Error en la actualización de la cantidad', generateErrorCart({ err }), 'Error update quantity', EErrors.CART_ERROR)

        }
	}

	async actualizarArrayCarrito(cartId, nuevosProductos) {
		try {
            const cart = await this.cart.findOne({ _id: cartId });
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }
            console.log(cart.products, nuevosProductos.products)
            cart.products = nuevosProductos.products;
            await cart.save();
            return cart;
        } catch (err) {
            CustomErrors.createError('Problema en agregar pid al cid', generateErrorCart({ err }), 'Error cart add', EErrors.CART_ERROR)
        }
	}
}

const CartDao = new cartDao();
export default CartDao;