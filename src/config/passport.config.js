import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userController from '../controllers/user.controller.js';
import { comparePassword, hashPassword } from '../utils/encript.util.js';
import CartController from '../controllers/cart.controller.js';
import { ExtractJwt, Strategy } from "passport-jwt";
import UserDTO from "../dto/user.dto.js";



const LocalStrategy = local.Strategy;
const jwtStrategy = Strategy;
const jwtExtract = ExtractJwt;

const inicializePassport = () => {
	passport.use(
		'register',
		new LocalStrategy(
			{ usernameField: 'email', passReqToCallback: true },
			async (req, username, password, done) => {
				const { first_name, last_name, img } = req.body;

				try {
					if (!first_name || !last_name || !username) {
                        return done(null, false, {
                            message: 'Todos los campos deben estar llenos',
                        });
                    }
					// recuperar usuario con ese email
					const user = await userController.getByEmail(username);

					// si existe, devolver error
					if (user) {
						return done(null, false, {
							message: 'El usuario ya existe',
						});
					}

					// encriptar password
					const hashedPassword = await hashPassword(password);

					const userdto = new UserDTO({
                        first_name,
                        last_name,
                        username,
                        password: hashedPassword,
                        img,
                    });
						
					if (userdto.email === "eladmin@admin.com") {
                        userdto.rol = "ADMIN";
                    }

					const newUser = await userController.createUser(userdto);
					

					return done(null, newUser);
				} catch (error) {
					done(error);
				}
			}
		)
	);



	passport.use(
		'login',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
					const user = await userController.getByEmail(username);

					if (!user) {
						return done(null, false, { message: 'Usuario invalido' });
					}

					if (!comparePassword(user, password)) {
						return done(null, false, { message: 'Revise los datos ingresados' });
					}

					return done(null, user);
				} catch (error) {
					done(error);
				}
			}
		)
	);

	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: 'Iv1.709563a70cd440d4',
				clientSecret: '0bb1d1d483929947762e56d399e9345d79d649be',
				callbackURL: 'http://localhost:8080/api/users/githubcallback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					
					let user = await userController.getByEmail(profile._json.email);
					if (!user) {
						let newUser = {
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							img: profile._json.avatar_url,
						};
						user = await userController.createUser(newUser);
						done(null, user);

						if (!user.cart) {
							const newCart = await CartController.agregarCarrito();
							user.cart = newCart._id;
							await user.save();
						}

					} else {
						done(null, user);
					}
				} catch (error) {
					done(error, false);
				}
			}
		)
	);

    passport.serializeUser((user, done) => {
		done(null, user._id);
	});

    passport.deserializeUser(async (id, done) => {
        const user = await userController.getUserById(id);
        if (user.email === "adminCoder@coder.com") {
            const adminUser = { ...user, role: "admin" };
            done(null, adminUser);
        } else {
            done(null, user);
        }
    });

	passport.use(
		'jwt',
		new jwtStrategy(
			{
				jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
				secretOrKey: 'privatekey',
			},
			(payload, done) => {
				done(null, payload);
			}
		),
		async (payload, done) => {
			try {
				return done(null, payload)
			} catch (error) {
				done(error)
			}
		}
	)
};



const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token']
    }
    return token;
}



export default inicializePassport;