import { messageModel } from "../mongo/models/messageModel.js";

export default class Carts {

    constructor() {}

    createMessage = async () => {
        await messageModel.create(data)

        return true
    }

}