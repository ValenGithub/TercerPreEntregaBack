import  { ChatModel }  from '../models/chatModel.js'

export default class MessageService {
  constructor(io) {
    this.io = io;
  }

  async obtenerMensajes() {
    try {
      const mensajes = await ChatModel.find().lean();
      return mensajes;
    } catch (error) {
      throw error;
    }
  }

  async guardarMensaje(user, message) {
    try {
      const nuevoMensaje = new ChatModel({ user, message });
      await nuevoMensaje.save();
      this.io.emit('messages', await this.obtenerMensajes()); // Emitir el nuevo mensaje a todos los clientes conectados
    } catch (error) {
      throw error;
    }
  }
}

// const messageService = new MessageService();
// export default messageService;


