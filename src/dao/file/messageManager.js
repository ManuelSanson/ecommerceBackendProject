import fs from 'fs';
import { logger } from '../../config/logger.js';

export default class MessageManager {
    
    constructor() {
        this.path = "src/db/messages.json"
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

    async createMessage({user, message}) {
        const messages = await fs.promises.readFile(this.path, "utf-8")
        
        const newMessage = {user, message}

        messages.push(newMessage)

        this.#writeFile(messages)

        return newMessage        
    }
}