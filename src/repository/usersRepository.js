import UserDTO from "../dao1/dto/usersDTO.js";

export default class Users {

    constructor(dao) {
        this.dao = dao
    }

    createUser = async (data) => {
        const dataToInsert = new UserDTO(data)
        return await this.dao.createUser(dataToInsert)
    }

    getAllUsers = async () => {
        return await this.dao.getAllUsers()
    }

    getUserByEmail = async (email) => {
        return await this.dao.getUserByEmail(email)
    }

    getUserByID = async (uid) => {
        return await this.dao.getUserByID(uid)
    }

    deleteUser = async (uid) => {
        return await this.dao.deleteUser(uid)
    }

    deleteInactiveUsers = async () => {
        return await this.dao.deleteInactiveUsers()
    }

    changeUserRole = async (uid) => {
        return await this.dao.changeUserRole(uid)
    }

    uploadDocument = async (uid, document) => {
        return await this.dao.uploadDocument(uid, document)
    }

    updateLastConnection = async (uid) => {
        return await this.dao.updateLastConnection(uid)
    }
}