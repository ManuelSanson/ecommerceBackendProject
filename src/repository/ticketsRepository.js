import TicketDTO from "../dao/dto/ticketsDTO.js";

export default class Tickets {

    constructor(dao) {
        this.dao = dao
    }

    getTickets = async () => {
        return await this.dao.getTickets()
    }

    getTicketByID = async (tid) => {
        return await this.dao.getTicketByID(tid)
    }

    createTicket = async (data) => {
        const dataToInsert = new TicketDTO(data)
        
        return await this.dao.createTicket(dataToInsert)
    }

}