import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    age: Number,
    role: {
        type: String,
        default: 'user'
    }
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel