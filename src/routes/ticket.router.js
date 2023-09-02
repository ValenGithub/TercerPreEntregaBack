import { Router } from "express";
import { middlewarePassportJwt } from "../middlewares/jwt.middleware.js"
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import productModel from "../models/productModel.js";
import userModel from "../models/user.model.js";



const ticketRouter = Router()


ticketRouter.post('/:id', middlewarePassportJwt, async (req, res, next) => {
  try {
  const user = req.user;
  const client = await userModel.findById(user._id);
  const cartClient = await cartController.obtenerCarritoById(req.params.id);
  
  client.cart.push(cartClient);
  await client.save();
  
  const productsToUpdate = cartClient.products.map(item => {
    return {
      productId: item.product._id,
      quantity: item.quantity
    };
  });
  
  const updateOperations = productsToUpdate.map(item => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { stock: -item.quantity } }
    }
  }));
  
  await productModel.bulkWrite(updateOperations);
  
  const total = cartClient.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
  const purchase_datatime = new Date().toLocaleString();
  const generatedCode = Math.floor(Math.random() * 90000) + 10000;
  
  const createTicket = await ticketController.createTicket({
    code: generatedCode,
    purchase_datatime,
    amount: total,
    purchaser: user.email,
  });
  console.log(createTicket)
  return res.status(201).send(createTicket);
  } catch (err) {
    
    
    return res.status(500).send(err);
  }
});



ticketRouter.get('/', async (req, res) => {
  const tickets = await ticketController.getTicket()
  res.status(200).send(tickets)
})


export { ticketRouter }