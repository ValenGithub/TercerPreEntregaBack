import Router from "express";
import productController from "../controllers/product.controller.js"
import userController from '../controllers/user.controller.js';
import cartController from "../controllers/cart.controller.js";
import { ensureAdmin } from '../middlewares/auth.middleware.js';
import { middlewarePassportJwt } from "../middlewares/jwt.middleware.js";

const viewsRouter = Router();



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
	const autorizado = user.rol === "ADMIN" || user.rol === "PREMIUM";
	res.render('products', {...data, autorizado});
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productController.obtenerProductos();
  res.render('realTimeProducts', { renderProdList: products });
});

viewsRouter.get('/chat', middlewarePassportJwt, async (req, res) => {
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

viewsRouter.get('/resetpassword', (req, res) => {
	res.render('resetpassword', {
	  title: 'restablecer contrasena',
	});
  });

viewsRouter.get('/forgotpassword/:token', (req, res) => {
	const token = req.params;
	res.render('forgotpassword', {
	  title: 'Olvido contrasena',
	  token: token.token
	});
  });

  viewsRouter.get('/emailsent', (req, res) => {
	res.render('emailsent', {
	  title: 'Se envio email de restablecimiento',
	});
  });
  
  viewsRouter.get('/restpassword', (req, res) => {
	res.render('restpassword', {
	  title: 'restablecer contrasena',
	});
  });
  

viewsRouter.get('/current', middlewarePassportJwt, (req, res) => {
	const user = req.user;
	const autorizado = user.rol === "ADMIN" || user.rol === "PREMIUM";
	console.log(autorizado)
	res.render('index', {
		title: 'Perfil de Usuario',
		message: 'Private route',
		user,
		autorizado
	  });
});

viewsRouter.get('/admincontroluser', middlewarePassportJwt, ensureAdmin, async (req, res) => {
		const user = req.user
		const users = await userController.getAll()
        res.render('admincontroluser', { user, users });       
    
});

viewsRouter.get('/agregarproducto', middlewarePassportJwt, async(req, res) =>{
	const user = req.user

	res.render('agregarproducto', {user})
}
)
viewsRouter.get('/carterror', (req, res) => {
    res.render('carterror');
});



export default viewsRouter;
