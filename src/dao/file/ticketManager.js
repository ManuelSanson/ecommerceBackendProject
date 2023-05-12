import fs from 'fs';
import { logger } from '../../config/logger.js';
import bcrypt from 'bcrypt';

export default class TicketManager {
    
    constructor() {
        this.path = "src/db/tickets.json"
        this.#init()
    }

    #init() {
        try {
            const existFile = fs.existsSync(this.path)
            if (existFile) {
                return
            } else {
                fs.writeFileSync(this.path, JSON.stringify([]))
            }
        } catch (error) {
            logger.error(error);
        }
    }

    #writeFile(data) {
        fs.promises.writeFile(this.path, JSON.stringify(data, null, 3))
    }

    async getTickets() {
        const response = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(response)
    }

    async createTicket({purchaseDateTime, amount, purchaser}) {
        const tickets = await this.getTickets()
        
        const newTicket = {purchaseDateTime, amount, purchaser}

        newTicket.id = !tickets.length ? 1 : Number(tickets[tickets.length - 1].id) + 1
        newTicket.code = bcrypt.genSaltSync(10)

        tickets.push(newTicket)

        this.#writeFile(tickets)

        return newTicket
    }

    async getTicketByID(tid) {
        const tickets = await this.getTickets()
        const ticketFound = tickets.find(ticket => Number(ticket.id) === tid)

        return ticketFound
    } 
}