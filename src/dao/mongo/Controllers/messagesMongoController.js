import { messageModel } from "../models/messageModel.js"

export default class Carts {

    constructor() {}

    createMessage = async () => {
        await messageModel.create(data)

        return true
    }

}