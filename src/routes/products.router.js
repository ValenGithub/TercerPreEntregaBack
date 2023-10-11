import { Router } from 'express';
import { Server } from "socket.io";
import productController from '../controllers/product.controller.js'
import { logger } from '../middlewares/logger.middleware.js'; 
import { ensurePremiumOrAdmin } from '../middlewares/auth.middleware.js';
import { middlewarePassportJwt } from '../middlewares/jwt.middleware.js';
import { transporter } from '../utils/nodemailer.js';
import enviroment from '../config/enviroment.js';
import userModel from '../models/user.model.js';

const productsRouter = Router();

const server = new Server();
const io = server.io;

productsRouter.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query; 
        const products = await productController.obtenerProductosPaginados(limit, page, sort, query);
        res.send(products);
    } catch (err) {
        logger.error("Error al obtener productos paginados: " + err.message);
        res.status(500).send({ err });
    }
});


productsRouter.post('/',middlewarePassportJwt,ensurePremiumOrAdmin,  async (req, res) => {
    try {
        const product = await productController.agregarProducto(req.body);
        res.redirect('/products');
    } catch (err) {
        logger.error("Error al agregar producto: " + err.message);
        res.status(500).send({ error: err.message });
    } 
});
productsRouter.put('/:pid',middlewarePassportJwt,ensurePremiumOrAdmin,  async (req, res) => {
	const pid = req.params.pid;
	try {
		const product = await productController.actualizarProducto(pid, req.body);
		req.io.emit("updatedProducts", await req.productController.obtenerProductos());
		res.status(201).send(product);
	} catch (err) {
		logger.error("Error al actualizar producto: " + err.message);
		res.status(500).send({ err });
	}
});


productsRouter.delete('/:pid', middlewarePassportJwt, ensurePremiumOrAdmin, async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productController.obtenerProductoById(pid);

        // Si el usuario es PREMIUM y no es el propietario del producto
        if (req.user.rol === 'PREMIUM' && String(req.user._id) !== String(product.owner)) {
            logger.warn(`Usuario PREMIUM con ID ${req.user._id} intentó eliminar un producto que no le pertenece`);
            return res.status(403).send({ message: "No tienes permisos para eliminar este producto" });
        }

        // Si el producto es eliminado por un ADMIN y el propietario es un usuario PREMIUM, enviar correo
        const owner = await userModel.findById(product.owner);
        if (owner && owner.rol === 'PREMIUM') {
            const emailOptions = {
                from: `Notificaciones <${enviroment.NODEMAILER_MAIL}>`,
                to: owner.email,  
                subject: 'Tu producto ha sido eliminado',
                text: `El producto ${product.name} ha sido eliminado de nuestra plataforma.`
            };
            await transporter.sendMail(emailOptions);
        }

        await productController.eliminarProducto(pid);
        req.io.emit("updatedProducts", await req.productController.obtenerProductos());
        res.sendStatus(204);
    } catch (err) {
        logger.error("Error al eliminar producto: " + err.message);
        res.status(500).send({ err });
    }
});


productsRouter.get('/:pid',middlewarePassportJwt,ensurePremiumOrAdmin, async (req, res) => {
	try {
		let productoSolicitado = await productController.obtenerProductoById(req.params.pid);
		res.send({ producto: productoSolicitado });
	} catch (err) {
		logger.error("Error al obtener producto por ID: " + err.message);
		res.status(400).send({ err });
	}
});

export { productsRouter };