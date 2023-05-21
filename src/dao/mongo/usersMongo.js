import config from "../../config/config.js";
import { logger } from "../../config/logger.js";
import userModel from "../mongo/models/userModel.js";
import nodemailer from 'nodemailer';

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

    deleteInactiveUsers = async () => {
        const users = await userModel.find()
        const currentDate = new Date()

        const usersToBeDeleted = users.filter(user => user.lastConnection && (Math.abs(currentDate - user.lastConnection) / 36e5) >= 48).map(user => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                type: 'PLAIN',
                auth: {
                    user: config.mailUser,
                    pass: config.mailPass
                },
                tls: {
                rejectUnauthorized: false
                }
            });
        
            const mailOptions = {
                from: config.mailUser,
                to: user.email,
                subject: 'Eliminación de cuenta',
                html: `
                <p>Debido a tu inactividad en las últimas 48 horas, hemos eliminado tu cuenta.</p>
                <p>Para registrarte nuevamente, haz click <a href="http://localhost:8080/session/register">aquí</a>. </p>
                `,
            }
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(error)
                }
                logger.info('Email sent: ' + info.response)
            })

            return user._id
        })

        return userModel.deleteMany({_id: {'$in': usersToBeDeleted}})
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