import { Router } from "express";
import { ChatModel } from "../models/chatModel.js";
import { middlewarePassportJwt } from "../middlewares/jwt.middleware.js";
import { io } from "../utils/socket.js";

 
const messageRouter = Router()


messageRouter.post('/', middlewarePassportJwt , async (req, res) => {

    try {

        const { user, message } = req.body;
        const newMessage = new ChatModel({ user, message });
        await newMessage.save();

        const messages = await ChatModel.find({}).lean();

        io.emit('List-Message', {
            messages: messages

        })

        res.redirect('/chat');
    } catch (err) {
        res.render('error', { error: err.message });
    }
});

export { messageRouter }