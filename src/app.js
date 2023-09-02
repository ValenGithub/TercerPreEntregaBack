// importamos el paquete express
import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { messageRouter } from './routes/chat.router.js';
import { usersRouter } from './routes/user.router.js';
import { ticketRouter } from './routes/ticket.router.js';
import exphbs from "express-handlebars";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import productController from './controllers/product.controller.js'
import MessageService from './dao/message.service.js';
import mongoose from 'mongoose';
import CartController from './controllers/cart.controller.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import inicializePassport from './config/passport.config.js';
import enviroment from './config/enviroment.js'


const messages = [];
// Creamos la aplicación
const app = express();
//const productManager = new ProductManager("./products.json");

app.use(express.json());
// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine('handlebars', exphbs.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');
app.use(cookieParser())
app.use((req, res, next) => {
  res.locals.layout = 'main'; // Establecer el nombre del layout principal
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
  req.productController = productController; // Pasamos el objeto productManager a cada solicitud
  req.io = io; // Pasamos el objeto io a cada solicitud
  next();
});

app.use(cookieParser('B2zdY3B$pHmxW%'));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chat', messageRouter);
app.use('/api/users', usersRouter);
app.use('/api/purchase', ticketRouter);



mongoose.connect(
	enviroment.DB_LINK
);

const httpServer = app.listen(enviroment.PORT, () => {
  console.log(`Listening in ${enviroment.PORT}`); //Check de que el servidor se encuentra funcionando en el puerto 8080.
});
const io = new Server(httpServer);
const messageService = new MessageService(io);
 
io.on("connection", async (socket) => {
  try {
    console.log("New client connected!");

    socket.emit("productList", await productController.obtenerProductos());
    socket.emit('messages', await messageService.obtenerMensajes());
  
    socket.on('agregarProducto', async ({ cartId, productId }) => {
      try {
        await CartController.agregarProductoCarrito(cartId,productId);
        let cart = await CartController.obtenerCarritoById(cartId);
        io.emit('Cartproducts', cart );
      } catch (error) {
        console.log(error)
      }
    }); 

    socket.on('message', async (message) => {
      console.log(message);
      const { user, msj } = message;
      await messageService.guardarMensaje(user, msj);
      const nuevosMensajes = await messageService.obtenerMensajes();
      socket.emit('messages', nuevosMensajes);
    });

    socket.on('sayhello', (data) => {
      socket.broadcast.emit('connected', data);
    });
  } catch (err) {
    console.log(err);
  }
});


