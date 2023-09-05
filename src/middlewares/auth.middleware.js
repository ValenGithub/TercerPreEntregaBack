
export function isAuth(req, res, next) {

	if (req.user.rol === 'ADMIN') {
		console.log(`${req.user.rol} no autorizado`);
		return res.sendStatus(500)
	}
	
	next();

}

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

  export function ensureAdmin  (req, res, next)  {
    if (req.user && req.user.rol === 'ADMIN') {
        // El usuario es un administrador, permite la acción
        next();
    } else {
        // El usuario no es un administrador, deniega el acceso
        const error = new Error('Acceso no autorizado');
        error.status = 403; // Código de estado HTTP para acceso prohibido
        next(error);
    }
};