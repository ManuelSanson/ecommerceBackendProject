import { messageModel } from "../mongo/models/messageModel.js";

export default class Messages {

    constructor() {}

    createMessage = async (data) => {
        await messageModel.create(data)

        return true
    }

}