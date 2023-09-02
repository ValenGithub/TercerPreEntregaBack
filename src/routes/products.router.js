import { Router } from 'express';
import { Server } from "socket.io";
import productController from '../controllers/product.controller.js'
import { isAuth } from '../middlewares/auth.middleware.js';
import { middlewarePassportJwt } from '../middlewares/jwt.middleware.js';

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
		req.io.emit("updatedProducts", await req.productController.obtenerProductos());
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

//METODOS ANTERIORES

// productsRouter.get('/', async (req, res) => {
//   const limit = req.query.limit;
//   let products = await productManager.getProducts();

//   if (limit && !isNaN(limit)) {
//     res.send({ productos: products.slice(0, parseInt(limit)) });
//   } else {
//     res.send({ productos: products });
//   }
// });

// productsRouter.post('/', async (req, res) => {
//     let { producto } = req.body;
  
//     const camposRequeridos = {
//         title: true,
//         description: true,
//         price: true,
//         thumbnail: true,
//         code: true,
//         stock: true
//     };
  
//     const camposFaltantes = [];
  
//     for (const campo of Object.keys(camposRequeridos)) {
//         if (!producto.hasOwnProperty(campo)) {
//             camposFaltantes.push(campo);
//         }
//     }
  
//     if (camposFaltantes.length > 0) {
//         return res.status(400).send(`Los siguientes campos son requeridos: ${camposFaltantes.join(', ')}`);
//     }
  
//     try {
//         await req.productManager.addProduct(producto);
//         req.io.emit("updatedProducts", await req.productManager.getProducts()); // Emitir el evento a través de req.io
//         res.status(201).send({ producto: producto });
//     } catch (err) {
//         res.status(400).send({ err });
//     }
// });

// productsRouter.put('/:pid', async (req, res) => {
//     const id = parseInt(req.params.pid);
//     let { producto } = req.body;
//     try {
//         let anterior = await req.productManager.getProductById(id);
//         await req.productManager.updateProduct(id, producto);
//         req.io.emit("updatedProducts", await req.productManager.getProducts()); // Emitir el evento a través de req.io
//         res.send({ anterior, productoActualizado: producto });
//     } catch (err) {
//         res.status(400).send({ err });
//     }
// });

// productsRouter.delete('/:pid', async (req, res) => {
//     const id = parseInt(req.params.pid);
  
//     try {
//         await req.productManager.deleteProduct(id);
//         req.io.emit("updatedProducts", await req.productManager.getProducts()); // Emitir el evento a través de req.io
//         res.send();
//     } catch (err) {
//         res.status(400).send({ err });
//     }
// });

