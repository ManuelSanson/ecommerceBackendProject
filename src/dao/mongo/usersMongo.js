import userModel from "../mongo/models/userModel.js";

export default class Users {

    constructor() {}

    createUser = async (data) => {
        await userModel.create(data)

        return true
    }

    getUserByEmail = async (email) => {
        const user = await userModel.findOne({email: email})

        return user
    }

    getUserByID = async (uid) => {
        const user = await userModel.findOne({_id: uid})

        return user
    }

}