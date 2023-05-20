import userModel from "../mongo/models/userModel.js";

export default class Users {

    constructor() {}

    createUser = async (data) => {
        const user = await userModel.create(data)

        return user
    }

    getAllUsers = async () => {
        const users = await userModel.find()

        return users
    }

    getUserByEmail = async (email) => {
        const user = await userModel.findOne({email: email})

        return user
    }

    getUserByID = async (uid) => {
        const user = await userModel.findOne({_id: uid})

        return user
    }

    deleteUser = async (uid) => {
        const user = await userModel.deleteOne({_id: uid})

        return user
    }

    changeUserRole = async (uid) => {
        const user = await userModel.findOne({_id: uid})

        let role = user.role
        const userRole = 'user'
        const premiumRole = 'premium'

        if (role === userRole) {
            role = premiumRole
        } else if (role === premiumRole) {
            role = userRole
        }

        user.role = role

        await user.save()

        return role
    }

    uploadDocument = async (uid, document) => {
        const user = await userModel.findOne({_id: uid})

        user.documents.push(document[0])

        await user.save()

        return user.documents
    }

    updateLastConnection = async (uid) => {
        const user = await userModel.findOne({_id: uid})

        user.lastConnection = new Date()

        await user.save()

        return user.lastConnection
    }

}