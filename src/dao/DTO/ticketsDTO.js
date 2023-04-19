export default class TicketDTO {
    
    constructor(ticket) {
        this.id = ticket.id || ticket._id || null
        this.purchaseDateTime = ticket.purchaseDateTime || ""
        this.status = ticket.status || ""
        this.amount = ticket.amount || ""
        this.purchase = ticket.purchase || ""
    }
}