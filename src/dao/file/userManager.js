import fs from 'fs';
import { logger } from '../../config/logger.js';

export default class UserManager {
    
    constructor() {
        this.path = "src/db/users.json"
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

    async getAllUsers() {
        const response = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(response)
    }

    async createUser({firstName, lastName, age, email}) {
        const users = await this.getUsers()
        
        const newUser = {firstName, lastName, age, email}

        newUser.id = !users.length ? 1 : Number(users[users.length - 1].id) + 1

        users.push(newUser)

        this.#writeFile(users)

        return newUser
    }

    async getUserByEmail(email) {
        const users = await this.getUsers()
        const userFound = users.find(user => user.email === email)

        return userFound
    } 

    async getUserByID(uid) {
        const users = await this.getUsers()
        const userFound = users.find(user => Number(user.id) === uid)

        return userFound
    }
    
    async changeUserRole(uid) {
        const user = await this.getUserByID(uid)

        let role = user.role
        const userRole = 'user'
        const premiumRole = 'premium'

        if (role === userRole) {
            role = premiumRole
        }

        if (role === premiumRole) {
            role = userRole
        }

        user.role = role

        return role
    }

    uploadDocument = async (uid, document) => {
        const user = await this.getUserByID(uid)

        user.documents.push(document[0])

        return user.documents
    }

    updateLastConnection = async (uid) => {
        const user = await this.getUserByID(uid)

        user.lastConnection = new Date().toLocaleDateString()

        return user.lastConnection
    }
}