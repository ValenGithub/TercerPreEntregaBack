export default class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code;  
        this.purchase_datatime = ticket.purchase_datatime;  
        this.purchaser = ticket.purchaser;  
        this.amount = ticket.amount; 
    }
}
