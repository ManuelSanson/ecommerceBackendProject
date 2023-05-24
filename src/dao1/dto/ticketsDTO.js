export default class TicketDTO {
    
    constructor(ticket) {
        this.id = ticket.id || ticket._id || null
        this.purchaseDateTime = ticket.purchaseDateTime || ""
        this.code = ticket.code || ""
        this.amount = ticket.amount || ""
        this.purchaser = ticket.purchaser || ""
    }
}