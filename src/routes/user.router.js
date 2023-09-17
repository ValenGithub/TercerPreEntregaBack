import { Router } from 'express';
import passport from "passport";
import { generateToken } from "../middlewares/jwt.middleware.js";
import ErrorCodes from "../utils/EErrors.js";
import { generateErrorAutenticacion, generateErrorDeslogueo, generateErrorEnrutamiento, generateUserErrorInfo } from "../utils/info.js";
import CustomErrors from "../utils/customErrors.js";
import { ensureAdmin } from '../middlewares/auth.middleware.js';

const usersRouter = Router();

usersRouter.post('/', (req, res, next) => {
	passport.authenticate('register', (err, user, info) => {
		if (user) {
			res.status(200).redirect('/login')
		}

		if (info) {
		
			CustomErrors.createError("Error de autenticacion", generateErrorAutenticacion(), 'Register Error', ErrorCodes.AUTENTICACION_ERROR);
		}

		return next(err)

	})(req, res, next);
});




usersRouter.post('/auth', (req, res, next) => {
	passport.authenticate('login', (err, user, info) => {

		if (err) {
			return next(err)
		}


		if (!user) {
			CustomErrors.createError("Error de autenticacion", generateUserErrorInfo(), 'Login Error', ErrorCodes.AUTENTICACION_ERROR);
		}

		const token = generateToken(user);
		
		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 60000000,
		}).redirect('/products');

	})(req, res, next);
});


usersRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (err, req, res, next) => {
	if (err) {
		CustomErrors.createError('Error Routing', generateErrorEnrutamiento(), 'no redireciono', ErrorCodes.ROUTING_ERROR)
	}

});
usersRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		const user = req.user;
		const token = generateToken(user)
		
		
		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 60000000,
			
		}).redirect('/products')
		
	}
);


usersRouter.post('/logout', (req, res) => {
	req.session.destroy(); 
	res.redirect('/login');
  });


  usersRouter.post('/admin/change-role/:userId', ensureAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { newRole } = req.body;

        // Cambia el rol del usuario utilizando el controlador de usuarios
        const updatedUser = await userController.changeUserRole(userId, newRole);

        // Redirige de nuevo a la página de administración de usuarios con un mensaje de éxito
        res.redirect('/admin/users?success=' + encodeURIComponent('Rol cambiado con éxito'));
    } catch (error) {
        // Maneja errores si ocurren durante el cambio de rol
        next(error);
    }
});



  
// Registro Callback Github //




export { usersRouter };
