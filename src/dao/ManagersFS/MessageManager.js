import fs from 'fs';
import { messageManager } from './index.js';

export class MessageManager {
    
    constructor(path) {
        this.path = path
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
            console.log(error);
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