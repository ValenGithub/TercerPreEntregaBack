
import ticketModel from "../models/ticketModel.js";

class TicketDao {
    constructor() {
        this.ticket = ticketModel;
    }


    async createTicket(ticket) {
        try {
            const createTicket = this.ticket.create(ticket)
            return createTicket;
        } catch (error) {
            console.log('No se pudo crear el ticket', error)
        }
    }

    async getTicket() {
        try {
            const getticket = this.ticket.find({})
            return getticket;
        } catch (error) {
            console.log('Error a traer los ticket', error)
        }
    }

    async getTicketId(id) {
        try {
            const ticketid = this.ticket.findById(id)
            return ticketid;
        } catch (error) {
            console.log('No se pudo obtener el ticket', error)
        }

    }

    async deleteTicket(id) {
        try {
            const deleteTicket = this.ticket.deleteOne(id)
            return deleteTicket;
        } catch (error) {
            console.log('No se pudo eliminar el ticket', error)
        }

    }

}

const ticketDao = new TicketDao;
export default ticketDao