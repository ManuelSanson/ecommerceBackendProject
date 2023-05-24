import MessageDTO from '../dao/dto/messageDTO.js';

export default class MessagesRepository {

    constructor(dao) {
        this.dao = dao
    }

    create = async(data) => {
        const dataToInsert = new MessageDTO(data)
        const result = await this.dao.add(dataToInsert)

        return result
    }

}
