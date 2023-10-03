import ticketDao from "../dao/ticket.dao.js";
import TickeService from "../services/ticket.service.js";
import TicketDTO from "../dto/ticket.dto.js";
import { logger } from "../middlewares/logger.middleware.js"; 

class TicketController {
    constructor() {
        this.service = new TickeService(ticketDao);
    }

    async createTicket(ticket) {
        try {
            const createdTicket = await this.service.createTicket(ticket);
            logger.info('Ticket creado exitosamente.');
            return new TicketDTO(createdTicket); 
        } catch (error) {
            logger.error('No se pudo crear el ticket: ' + error.message);
        }
    }

    async getTicket() {
        try {
            const tickets = await this.service.getTicket();
            logger.info('Tickets obtenidos exitosamente.');
            return tickets.map(ticket => new TicketDTO(ticket)); 
        } catch (error) {
            logger.error('Error al traer los tickets: ' + error.message);
        }
    }

    async getTicketId(id) {
        try {
            const ticket = await this.service.getTicketId(id);
            logger.info(`Ticket con ID ${id} obtenido exitosamente.`);
            return new TicketDTO(ticket); 
        } catch (error) {
            logger.error(`No se pudo obtener el ticket con ID ${id}: ` + error.message);
        }

    }

    async deleteTicket(id) {
        try {
            await this.service.deleteTicket(id);
            logger.info(`Ticket con ID ${id} eliminado exitosamente.`);
        } catch (error) {
            logger.error(`No se pudo eliminar el ticket con ID ${id}: ` + error.message);
        }

    }

}

const ticketController = new TicketController;
export default ticketController;
