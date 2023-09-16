import { Router } from 'express';
import { Server } from "socket.io";
import productController from '../controllers/product.controller.js'

const productsRouter = Router();

// Configuración de Socket.IO
const server = new Server();
const io = server.io;


productsRouter.get('/', async (req, res) => {
	try {
		const products = await productController.obtenerProductosPaginados();
		res.send(products);
	} catch (err) {
		res.status(500).send({ err });
	}
});


productsRouter.post('/',  async (req, res) => {
	try {
		
		const product = await productController.agregarProducto(req.body);
		res.status(201).send(product);
	} catch (err) {
		res.status(500).send({ err });
	}
});

productsRouter.put('/:pid',  async (req, res) => {
	const pid = req.params.pid;
	try {
		const product = await productController.actualizarProducto(pid, req.body);
		req.io.emit("updatedProducts", await req.productController.obtenerProductos());
		res.status(201).send(product);
	} catch (err) {
		res.status(500).send({ err });
	}
});

productsRouter.delete('/:pid', async (req, res) => {
	const pid = req.params.pid;
	try {
		await productController.eliminarProducto(pid);
		req.io.emit("updatedProducts", await req.productController.obtenerProductos());
		res.sendStatus(204);
	} catch (err) {
		res.status(500).send({ err });
	}
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    let productoSolicitado = await productController.obtenerProductoById(req.params.pid);
    res.send({ producto: productoSolicitado });
  } catch (err) {
    res.status(400).send({ err });
  }
});
export { productsRouter };

