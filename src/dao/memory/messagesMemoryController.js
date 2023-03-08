export default class Messages {

    constructor() {
        this.data = []
    }

    async createMessage(data) {
        this.data.push(data)
    }
}