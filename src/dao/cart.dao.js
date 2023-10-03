import { cartModel } from '../models/cartModel.js';
import productModel from '../models/productModel.js';
import CustomErrors from '../utils/customErrors.js';
import { generateErrorCart } from '../utils/info.js';
import EErrors from '../utils/EErrors.js';
import { logger } from '../middlewares/logger.middleware.js';

class cartDao {
    constructor() {
        this.model = cartModel;
    }

    async agregarCarrito() {
        try {
            const cart = await this.model.create({ products: [] });
            logger.info('Carrito creado con éxito.');
            return cart;
        } catch (err) {
            logger.error(`Error al crear carrito: ${err.message}`);
            CustomErrors.createError('Problemas al crear un cart', generateErrorCart({ err }), 'Error create cart', EErrors.CART_ERROR);
        }
    }

    async obtenerCarritos() {
        try {
            const carritos = await this.model.find().lean();
            logger.info('Carritos obtenidos con éxito.');
            return carritos;
        } catch (err) {
            logger.error(`Error al obtener carritos: ${err.message}`);
            CustomErrors.createError('Problemas al conseguir los carritos', generateErrorCart({ err }), 'Error cart ID', EErrors.CART_ERROR);
        }
    }

    async obtenerCarritoById(cartId) {
        try {
            const cart = await this.model.findById(cartId).populate('products.product').lean();
            logger.info(`Carrito con ID: ${cartId} obtenido con éxito.`);
            return cart;
        } catch (err) {
            logger.error(`Error al obtener carrito por ID: ${err.message}`);
            CustomErrors.createError('Problemas al conseguir id cart', generateErrorCart({ err }), 'Error cart ID', EErrors.CART_ERROR);
        }
    }

    async agregarProductoCarrito(cid, pid) {
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
            logger.info(`Producto agregado al carrito con éxito. Carrito ID: ${cid}, Producto ID: ${pid}`);
            return cart;
        } catch (error) {
            logger.error(`Error al agregar producto al carrito: ${error.message}`);
            CustomErrors.createError('Problemas para agregar producto al carrito', generateErrorCart({ error }), 'Error al agregar', EErrors.CART_ERROR);
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const cart = await this.model.deleteOne({ _id: cartId });
            logger.info(`Carrito vaciado con éxito. ID: ${cartId}`);
            return cart;
        } catch (err) {
            logger.error(`Error al vaciar carrito: ${err.message}`);
            CustomErrors.createError('Error vaciar carrito', generateErrorCart({ err }), 'Error clean Cart', EErrors.CART_ERROR);
        }
    }

    async eliminarProductoDeCarrito(cartId, prodId) {
        try {
            const carrito = await this.model.findOne({ _id: cartId });
            const producto = carrito.products.find(item => item.product.toString() === prodId);

            if (producto) {
                if (producto.quantity > 1) {
                    producto.quantity -= 1;
                } else {
                    carrito.products = carrito.products.filter(item => item.product.toString() !== prodId);
                }

                await carrito.save();
                logger.info(`Producto eliminado del carrito con éxito. Carrito ID: ${cartId}, Producto ID: ${prodId}`);
                return carrito;
            }

            logger.warn(`Producto no encontrado en carrito. Carrito ID: ${cartId}, Producto ID: ${prodId}`);
            return carrito;
        } catch (error) {
            logger.error(`Error al eliminar producto de carrito: ${error.message}`);
            CustomErrors.createError('Problema al eliminar producto del carrito', generateErrorCart({ error }), 'Error al eliminar', EErrors.CART_ERROR);
        }
    }

    async actualizarCantidadProductoCarrito(cartId, prodId, newQuantity) {
        try {
            const cart = await this.cart.findOne({ _id: cartId });
            const product = cart.products.find(product => product._id == prodId);
            if (!product) {
                throw new Error('No se encontró el producto en el carrito');
            }

            product.quantity = newQuantity;
            await cart.save();
            logger.info(`Cantidad de producto actualizada con éxito. Carrito ID: ${cartId}, Producto ID: ${prodId}, Nueva cantidad: ${newQuantity}`);
            return cart;
        } catch (err) {
            logger.error(`Error al actualizar cantidad de producto en carrito: ${err.message}`);
            CustomErrors.createError('Error en la actualización de la cantidad', generateErrorCart({ err }), 'Error update quantity', EErrors.CART_ERROR);
        }
    }

    async actualizarArrayCarrito(cartId, nuevosProductos) {
        try {
            const cart = await this.cart.findOne({ _id: cartId });
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }
            cart.products = nuevosProductos.products;
            await cart.save();
            logger.info(`Array de productos en carrito actualizado con éxito. Carrito ID: ${cartId}`);
            return cart;
        } catch (err) {
            logger.error(`Error al actualizar array de productos en carrito: ${err.message}`);
            CustomErrors.createError('Problema en agregar pid al cid', generateErrorCart({ err }), 'Error cart add', EErrors.CART_ERROR);
        }
    }
}

const CartDao = new cartDao();
export default CartDao;
