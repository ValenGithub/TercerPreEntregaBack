import { Router } from 'express';
import passport from "passport";
import { generateToken, authToken } from "../middlewares/jwt.middleware.js";

const usersRouter = Router();

usersRouter.post(
	'/',
	passport.authenticate('register'),
	async (req, res) => {
		res.redirect('/login');	
	}
);

usersRouter.post(
	'/auth',
	passport.authenticate('login'),
	async (req, res) => {
		 try {
		// Verificamos que el usuario exista
		if (!req.user) return res.status(400).send('No user found');

		// Saco la contraseña y lo guardo en la sesion
		const user = req.user;
		delete user.password;
		const token = generateToken(user)
	
		
		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 60000000,
			
		}).redirect('/products')
		
	} catch (err){
		res.redirect('/login')
	}
		
	}
	
);

usersRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	async (req, res) => {}
);

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


  
// Registro Callback Github //




export { usersRouter };
