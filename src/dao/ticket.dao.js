
import ticketModel from "../models/ticketModel.js";
import CustomErrors from '../utils/customErrors.js';
import { generateErrorTicket } from '../utils/info.js';
import EErrors from '../utils/EErrors.js';

class TicketDao {
    constructor() {
        this.ticket = ticketModel;
    }


    async createTicket(ticket) {
        try {
            const createTicket = this.ticket.create(ticket)
            return createTicket;
        } catch (error) {
            CustomErrors.createError('Error al crear el ticket', generateErrorTicket({ err }), 'Not create', EErrors.TICKET_ERROR)
        }
    }

    async getTicket() {
        try {
            const getticket = this.ticket.find({})
            return getticket;
        } catch (error) {
            CustomErrors.createError('Error al obtener los ticket', generateErrorTicket({ err }), 'Not get', EErrors.TICKET_ERROR)
        }
    }

    async getTicketId(id) {
        try {
            const ticketid = this.ticket.findById(id)
            return ticketid;
        } catch (error) {
            CustomErrors.createError('Error al obtener el ticket', generateErrorTicket({ err }), 'Not get', EErrors.TICKET_ERROR)
        }

    }

    async deleteTicket(id) {
        try {
            const deleteTicket = this.ticket.deleteOne(id)
            return deleteTicket;
        } catch (error) {
            CustomErrors.createError('Error al eliminar el ticket', generateErrorTicket({ err }), 'Not delete', EErrors.TICKET_ERROR)
        }

    }

}

const ticketDao = new TicketDao;
export default ticketDao