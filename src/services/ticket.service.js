
export default class TickeService {
    constructor(dao) {
        this.dao = dao;
    }


    async createTicket(ticket) {
        try {
            const createTicket = this.dao.createTicket(ticket)
            return createTicket;
        } catch (error) {
            console.log('create ticket service error', error)
        }
    }

    async getTicket() {
        try {
            const getticket = this.dao.getTicket()
            return getticket;
        } catch (error) {
            console.log('Error al traer los ticket, capa de servicio', error)
        }
    }

    async getTicketId(id) {
        try {
            const ticketid = this.dao.getTicketId(id)
            return ticketid;
        } catch (error) {
            console.log('No se pudo obtener el ticket, capa de servicio', error)
        }

    }

    async deleteTicket(id) {
        try {
            const deleteTicket = this.dao.deleteTicket(id)
            return deleteTicket;
        } catch (error) {
            console.log('No se pudo eliminar el ticket, capa de servicio', error)
        }

    }

}