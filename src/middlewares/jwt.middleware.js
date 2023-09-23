import jwt from 'jsonwebtoken';
import passport from 'passport';
import enviroment from '../config/enviroment.js';
import { logger } from './logger.middleware.js';

const generateToken = (user) => {
	return jwt.sign(user.toJSON(), enviroment.KEYJWT, { expiresIn: '1h' });
};

const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	console.log(authHeader)
	if (!authHeader) {
		res.status(401).send({ message: 'Token not found' });
	}

	jwt.verify(authHeader, enviroment.KEYJWT, (err, credentials) => {
		if (err) {
			res.status(401).send({ message: 'Token not valid' });
		}
		req.user = credentials.user;
		next();
	});
};


const middlewarePassportJwt = async (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, usr, info) => {
		if (err) {
			logger.error(`Authentication error: ${err.message}`);
			next(err);
		}

		if (!usr) {
			logger.warn('Token JWT expired or user not authenticated');
			res.redirect('/errorcaduco')	
		} else {
			req.user = usr
			next()
		}

	})(req, res, next);
}





export { generateToken, authToken, middlewarePassportJwt };