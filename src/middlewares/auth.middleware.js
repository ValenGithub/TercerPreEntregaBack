import { logger } from "./logger.middleware.js";

export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/products');
	}
}

export function initializeSession (req, res, next)  {
	if (!req.session.user) {
	  req.session.user = {}; // Inicializa el objeto de usuario en la sesión si no existe
	}
	next();
  };

  export function ensureAdmin(req, res, next) {
    if (req.user && req.user.rol === 'ADMIN') {
        next();
    } else {
        if (!req.user) {
            logger.warn('Intento de acceso sin autenticación a recurso de ADMIN');
        } else {
            logger.warn(`Usuario con rol ${req.user.rol} intentó acceder a recurso para ADMIN`);
        }

        res.status(403).send('Acceso Denegado');  // O redirigir a una página de error. 
        
    }
};

export function ensurePremiumRole  (req, res, next)  {
	if (req.user && req.user.rol === 'PREMIUM') {
	  next();  // Continuar si el usuario es PREMIUM.
	} else {
	  if (!req.user) {
		logger.warn('Intento de acceso sin autenticación');
	  } else {
		logger.warn(`Usuario con rol ${req.user.rol} intentó acceder a recurso para PREMIUM`);
	  }
	  res.status(403).send('Acceso Denegado');  // O redirigir a una página de error.
	}
  };

  export function ensurePremiumOrAdmin(req, res, next) {
    if (req.user.rol === 'PREMIUM' || req.user.rol === 'ADMIN') {
        next();
    } else {
        logger.warn(`Acceso no autorizado: Usuario con rol ${req.user.rol} intentó realizar una acción restringida`);
        res.status(403).send({ message: 'Acceso no autorizado' });
    }
};