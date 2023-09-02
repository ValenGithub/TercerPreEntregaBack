import ticketDao from "../dao/ticket.dao.js";
import TickeService from "../services/ticket.service.js";


class TicketController {
    constructor() {
        this.service = new TickeService(ticketDao);
    }

    async createTicket(ticket) {
        try {
            const createTicket = this.service.createTicket(ticket)
            return createTicket;
        } catch (error) {
            console.log('No se pudo crear el ticket', error)
        }
    }

    async getTicket() {
        try {
            const getticket = this.service.getTicket()
            return getticket;
        } catch (error) {
            console.log('Error a traer los ticket', error)
        }
    }

    async getTicketId(id) {
        try {
            const ticketid = this.service.getTicketId(id)
            return ticketid;
        } catch (error) {
            console.log('No se pudo obtener el ticket', error)
        }

    }

    async deleteTicket(id) {
        try {
            const deleteTicket = this.service.deleteTicket(id)
            return deleteTicket;
        } catch (error) {
            console.log('No se pudo eliminar el ticket', error)
        }

    }

}

const ticketController = new TicketController;
export default ticketController;