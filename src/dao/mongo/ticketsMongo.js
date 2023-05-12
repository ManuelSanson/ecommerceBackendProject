import { ticketModel } from "./models/ticketModel.js";

export default class Tickets {

    constructor() {}

    getTickets = async () => {
        const tickets = await ticketModel.find()
        
        return tickets
    }

    getTicketByID = async (tid) => {
        const ticket = await ticketModel.findOne({_id: tid})
        
        return ticket
    }

    createTicket = async (data) => {
        const ticket = await ticketModel.create(data)

        return ticket
    }

}