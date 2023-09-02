import Router from "express";
import productController from "../controllers/product.controller.js"
import cartController from "../controllers/cart.controller.js";
import { isAuth} from '../middlewares/auth.middleware.js';
import { middlewarePassportJwt } from "../middlewares/jwt.middleware.js";

const viewsRouter = Router();

// viewsRouter.get("/", async (req, res) => {
//   const products = await productService.obtenerProductos();
//   res.render("index",  { renderProdList: products } );
// });

viewsRouter.get("/products", middlewarePassportJwt, async (req, res) => {
	const user = req.user
	const { limit, page, sort, query } = req.query;
	const data = await productController.obtenerProductosPaginados(
		limit,
		page,
		sort,
    	query
	);
	
	data.user = user;
	res.render('products', data);
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productController.obtenerProductos();
  res.render('realTimeProducts', { renderProdList: products });
});

viewsRouter.get('/chat',middlewarePassportJwt, async (req, res) => {
	const user = req.user;
	res.render('chat', user);
});

viewsRouter.get('/carts',middlewarePassportJwt, async (req, res) => {
	const user = req.user;	
	res.render('cart', {
		user
	  });
});




viewsRouter.get('/register', (req, res) => {
	res.render('register', {
		title: 'Registrar Nuevo Usuario',
	});
});

viewsRouter.get('/login', (req, res) => {
	if (req.isAuthenticated() && req.session.user?.first_Name) {
		// Si ya hay una sesión activa, redirigir al usuario a su perfil
		return res.redirect('/');
	}

	res.render('login', {
		title: 'Inicio de Sesión',
	});
});

viewsRouter.get('/current', middlewarePassportJwt, (req, res) => {
	const user = req.user
	console.log(user)
	res.render('index', {
		title: 'Perfil de Usuario',
		message: 'Private route',
		user
	  });
});




export default viewsRouter;
