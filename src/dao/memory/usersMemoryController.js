export default class Users {

    constructor() {
        this.data = []
    }

    getNextID = () => {
        const nextID = !this.data.length ? 1 : Number(this.data[this.data.length - 1].id) + 1

        return nextID
    }

    async getUsers() {
        return this.data
    }

    async createUser(data) {
        data.id = this.getNextID()

        this.data.push(data)
    }

    async getUserByEmail(email) {
        return this.data.find(d => d.email === email)
    } 

    async getUserByID(uid) {
        return this.data.find(d => d.id === uid)
    } 
}