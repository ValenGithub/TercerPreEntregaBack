
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
