import { Router } from 'express';
import passport from "passport";
import { generateToken } from "../middlewares/jwt.middleware.js";
import ErrorCodes from "../utils/EErrors.js";
import { generateErrorAutenticacion, generateErrorDeslogueo, generateErrorEnrutamiento, generateUserErrorInfo } from "../utils/info.js";
import CustomErrors from "../utils/customErrors.js";
import { ensureAdmin } from '../middlewares/auth.middleware.js';
import userController from "../controllers/user.controller.js";
import { logger } from "../middlewares/logger.middleware.js"; 
import { transporter } from "../utils/nodemailer.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";
import jwt from 'jsonwebtoken';
import userModel from "../models/user.model.js";
import enviroment from "../config/enviroment.js";

const usersRouter = Router();
const privatesecret = enviroment.KEYJWT;

usersRouter.post('/', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            logger.error(`Error en passport.authenticate: ${err.message}`);
            return res.status(500).json({ error: "Error interno. Inténtalo más tarde." });
        }
        
        if (user) {
            return res.status(200).redirect('/login');
        }

        if (info) {
            logger.warn(`Error al registrar usuario: ${info.message}`);
            return res.status(400).json({ error: info.message });
        }
    })(req, res, next);
});

usersRouter.post('/auth', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            logger.error(`Error en passport.authenticate (login): ${err.message}`);
            return next(err);
        }

        if (!user) {
            CustomErrors.createError("Error de autenticacion", generateUserErrorInfo(), 'Login Error', ErrorCodes.AUTENTICACION_ERROR);
            logger.warn("Error de autenticación durante el login");
        }

        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60000000,
        }).redirect('/products');
    })(req, res, next);
});

usersRouter.post('/forgotpassword', async (req, res, next) => {
	const uid = req.body;

	try {
		logger.info('Intentando obtener usuario por correo electrónico');
		const user = await userController.getByEmail(uid.email)
		logger.info('Generando token para el usuario');
		const token = generateToken(user);

		const emailOptions = {
			from: `Restablecer Contraseña <moreschivalen44@gmail.com>`,
			to: `${user.email}`,
			subject: 'Restablecimiento de Contraseña',
			html: `
              <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                   <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
                       <div style="text-align: center; padding: 20px 0;">
                       <h1 style="color: #333;">Restablecer tu Contraseña</h1>
					   <img class="logo" src="https://i.postimg.cc/pL1mYXqM/VIP-fotor-bg-remover-20230624162050.png"
                   </div>
                   <div style="padding: 20px;">
                          <p style="margin-bottom: 20px; font-size: 16px; color: #333;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                          <p style="margin-bottom: 20px;">
                           <a style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;" href="http://localhost:8080/forgotpassword/${token}">Restablecer Contraseña</a>
                           </p>
                           <p style="font-size: 14px; color: #777;">Si no has solicitado esto, puedes ignorar este correo electrónico.</p>
                         </div>
                     </div>
                 </div>`,
			attachments: [],
		};


		transporter.sendMail(emailOptions, (error, info) => {
			if (error) {
				logger.error(error)
			}
			logger.info('Email sent: ' + info)
		})
		res.redirect('/emailsent')
	} catch (err) {
		//agregar custon de errores//
		logger.error('no se envio el email de restablecimiento')
	}

});

usersRouter.post('/emailreset/:token', async (req, res, next) => {
	const user = req.params.token;
	const newPassword = req.body
	const password = newPassword.password

	try {
		const decodedUser = jwt.verify(user, privatesecret);
		const userID = await userModel.findById(decodedUser._id)

		if (comparePassword(decodedUser, newPassword.password)) {
			logger.warn(" no puede ser la misma contrasena")
			return res.redirect('/errorpassword')
		}

		const HashPassword = await hashPassword(password)
		userID.password = HashPassword
		userID.save()

		res.redirect('/login')
	} catch (err) {
		//agregar custon de errores//
		logger.error('expiro el tiempo, debe volver a enviar el email')
		res.redirect('/resetpassword')

	}
});




usersRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (err, req, res, next) => {
    if (err) {
        CustomErrors.createError('Error Routing', generateErrorEnrutamiento(), 'no redireciono', ErrorCodes.ROUTING_ERROR);
        logger.error(`Error en redirección a GitHub: ${err.message}`);
    }
});

usersRouter.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const user = req.user;
        const token = generateToken(user);
        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60000000,
        }).redirect('/products');
    }
);

usersRouter.post('/logout', (req, res) => {
    req.session.destroy(); 
    res.redirect('/login');
});

usersRouter.post('/premium/:uid', userController.changeUserRole);

usersRouter.post('/delete/:uid', userController.deleteUser);

export { usersRouter };