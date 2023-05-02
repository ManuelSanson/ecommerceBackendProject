import UserDTO from "../DAO/DTO/usersDTO.js";

export default class Users {

    constructor(dao) {
        this.dao = dao
    }

    createUser = async (data) => {
        const dataToInsert = new UserDTO(data)
        return await this.dao.createUser(dataToInsert)
    }

    getUserByEmail = async (email) => {
        return await this.dao.getUserByEmail(email)
    }

    getUserByID = async (uid) => {
        return await this.dao.getUserByID(uid)
    }

}