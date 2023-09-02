import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';
import { middlewarePassportJwt } from '../middlewares/jwt.middleware.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const cartsRouter = Router();
//const cartManager = new CartManager();


cartsRouter.post('/', middlewarePassportJwt, isAuth, async (req, res) => {
	const carrito = req.body;
	try {
		const nuevoCarrito = await CartController.agregarCarrito(carrito);
		res.status(201).send( nuevoCarrito );
	} catch (err) {
		res.status(500).send({ err });
	}
});

cartsRouter.get('/', async (req, res) => {
	try {
		const carritos = await CartController.obtenerCarritos();
		res.send(carritos);
	} catch (err) {
		res.status(500).send({ err });
	}
});

cartsRouter.get('/:cid', async (req, res) => {
	let cartItems = await CartController.obtenerCarritoById(req.params.cid); // Obtener los productos del carrito
	
	res.send(cartItems); // Renderizar la vista del carrito y pasar los datos del carrito
});


cartsRouter.post('/:cid/product/:pid',middlewarePassportJwt, isAuth, async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	
	try {
		const productAdded = await CartController.agregarProductoCarrito(
			cartId,
			productId
			);
			res.send(productAdded);
		} catch (err) {
			res.status(500).send({ err });
		}
	});
	
	cartsRouter.delete('/:cid', async (req, res) => {
		const cid = req.params.cid;
		try {
			await CartController.vaciarCarrito(cid);
			res.sendStatus(204); 
		} catch (err) {
			res.status(500).send({ err });
		}
	});

	cartsRouter.delete('/:cid/product/:pid', middlewarePassportJwt, isAuth, async (req, res) => {
		const cid = req.params.cid;
		const pid = req.params.pid
		try {
			await CartController.eliminarProductoDeCarrito(cid, pid);
			res.sendStatus(204); 
		} catch (err) {
			res.status(500).send({ err });
		}
	});

	cartsRouter.put('/:cid/products/:pid', middlewarePassportJwt, isAuth, async (req, res) => {
		const cid = req.params.cid;
		const pid = req.params.pid;
		const newQuantity = req.body.quantity;
		
		try {
		  await CartController.actualizarCantidadProductoCarrito(cid, pid, newQuantity);
		  res.sendStatus(204);
		} catch (err) {
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
			res.status(500).json({ error: err.message });
		}
	});
	
	export { cartsRouter };
	
	//METODOS ANTERIORES
	// cartsRouter.post('/', async (req, res) => {
	//   try {
	//     let nuevoCarrito = await cartManager.createCart();
	//     res.status(201).send({ carritos: nuevoCarrito });
	//   } catch (err) {
	//     res.status(400).send({ err });
	//   }
	// });
	
	// cartsRouter.get('/:cid', async (req, res) => {
	//     try{
	//         let productosDelCarrito = await cartManager.getCartProducts(parseInt(req.params.cid))
	//         res.send( productosDelCarrito );
	//     }catch (err){
	//         res.status(400).send({ err });
	//     }
	// })
	
	// cartsRouter.post('/:cid/product/:pid', async (req, res) => {
	//     try {
	//       let productoAgregado = await cartManager.addProductCart(parseInt(req.params.cid), parseInt(req.params.pid));
	//       res.status(201).send({ nuevoProducto: productoAgregado });
	//     } catch (err) {
	//       res.status(400).send({ err });
	//     }
	//   });