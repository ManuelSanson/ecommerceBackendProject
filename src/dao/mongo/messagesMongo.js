import { messageModel } from "../mongo/models/messageModel.js";

export default class Messages {

    constructor() {}

    createMessage = async (data) => {
        const message = await messageModel.create(data)

        return message
    }

}