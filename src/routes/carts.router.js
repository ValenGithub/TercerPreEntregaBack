import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';
import { middlewarePassportJwt } from '../middlewares/jwt.middleware.js';
import { logger } from '../middlewares/logger.middleware.js'; 

const cartsRouter = Router();

cartsRouter.post('/', middlewarePassportJwt , async (req, res) => {
	const carrito = req.body;
	try {
		const nuevoCarrito = await CartController.agregarCarrito(carrito);
		res.status(201).send(nuevoCarrito);
	} catch (err) {
		logger.error("Error al agregar carrito: " + err.message);
		res.status(500).send({ err });
	}
});

cartsRouter.get('/', async (req, res) => {
	try {
		const carritos = await CartController.obtenerCarritos();
		res.send(carritos);
	} catch (err) {
		logger.error("Error al obtener carritos: " + err.message);
		res.status(500).send({ err });
	}
});

cartsRouter.get('/:cid', async (req, res) => {
	try {
		let cartItems = await CartController.obtenerCarritoById(req.params.cid);
		res.send(cartItems);
	} catch (err) {
		logger.error("Error al obtener carrito por ID: " + err.message);
		res.status(500).send({ err });
	}
});

cartsRouter.post('/:cid/product/:pid', middlewarePassportJwt, async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	
	try {
		const productAdded = await CartController.agregarProductoCarrito(cartId, productId);
		res.send(productAdded);
	} catch (err) {
		logger.error("Error al agregar producto al carrito: " + err.message);
		res.status(500).send({ err });
	}
});

cartsRouter.delete('/:cid', async (req, res) => {
	const cid = req.params.cid;
	try {
		await CartController.vaciarCarrito(cid);
		res.sendStatus(204); 
	} catch (err) {
		logger.error("Error al vaciar carrito: " + err.message);
		res.status(500).send({ err });
	}
});

cartsRouter.delete('/:cid/product/:pid', middlewarePassportJwt, async (req, res) => {
	const cid = req.params.cid;
	const pid = req.params.pid;
	try {
		const eliminarProductoDeCarrito = await CartController.eliminarProductoDeCarrito(cid, pid);
		logger.info("Producto eliminado del carrito: " + eliminarProductoDeCarrito);
		if (eliminarProductoDeCarrito) {
			res.status(200).json({ message: "Producto eliminado correctamente" });
		} else {
			res.status(400).json({ message: "No se pudo eliminar el producto" });
		}
	} catch (err) {
		logger.error("Error al eliminar producto del carrito: " + err.message);
		res.status(500).send({ err });
	}
});

cartsRouter.put('/:cid/products/:pid', middlewarePassportJwt, async (req, res) => {
	const cid = req.params.cid;
	const pid = req.params.pid;
	const newQuantity = req.body.quantity;
	
	try {
		await CartController.actualizarCantidadProductoCarrito(cid, pid, newQuantity);
		res.sendStatus(204);
	} catch (err) {
		logger.error("Error al actualizar cantidad de producto en carrito: " + err.message);
		res.status(500).send({ err });
	}
});

cartsRouter.put('/:cid', async (req, res) => {
	const cid = req.params.cid;
	const nuevoArray = req.body;
	
	try {
		await CartController.actualizarArrayCarrito(cid, nuevoArray);
		res.sendStatus(204);
	} catch (err) {
		logger.error("Error al actualizar array del carrito: " + err.message);
		res.status(500).send({ error: err.message });
	}
});

export { cartsRouter };