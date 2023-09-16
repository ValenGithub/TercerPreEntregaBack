// importamos el paquete express
import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { messageRouter } from './routes/chat.router.js';
import { usersRouter } from './routes/user.router.js';
import { ticketRouter } from './routes/ticket.router.js';
import exphbs from "express-handlebars";
import viewsRouter from "./routes/views.router.js"
import productController from './controllers/product.controller.js'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import inicializePassport from './config/passport.config.js';
import enviroment from './config/enviroment.js';
import errorsManagerMiddleware from './middlewares/errorsManager.middleware.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { server, app } from './utils/socket.js';



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware)
app.use(express.static("public"));
app.engine('handlebars', exphbs.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');
app.use(cookieParser())
app.use((req, res, next) => {
  res.locals.layout = 'main'; 
  next();
});

const initializeSession = (req, res, next) => {
  if (!req.session.user) {
    req.session.user = {}; // Inicializa el objeto de usuario en la sesión si no existe
  }
  next();
};

// Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: enviroment.DB_LINK_CREATE,
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: 'B2zdY3B$pHmxW%',
		resave: true,
		saveUninitialized: true,
	})
);
app.use(initializeSession);
inicializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter); 

app.use((req, res, next) => {
  req.productController = productController; 
  req.io = io;
  next();
});

app.use(cookieParser('B2zdY3B$pHmxW%'));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chat', messageRouter);
app.use('/api/users', usersRouter);
app.use('/api/purchase', ticketRouter);


app.use(errorsManagerMiddleware)


mongoose.connect(
	enviroment.DB_LINK
);

const httpServer = enviroment.PORT;
server.listen(httpServer, () => console.log(`estoy escuchando ${httpServer}...`)); 







