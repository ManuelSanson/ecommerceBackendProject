import { Router } from "express";
import mongoose from "mongoose";
import { logger } from '../config/logger.js';
import { UserService } from "../repository/index.js";
import { cpUpload } from "../config/multerConfig.js";
import { adminAuth, loginAuth, usersAuth } from "../middlewares/authorizations.js";

export const usersRouter = Router()

//Get all users
usersRouter.get('/', adminAuth, async (req, res) => {
    try {
        const users = await UserService.getAllUsers()
        
        let userDetails = []
        users.map(user => {
            const details = {
                firstName: user.firstName,
                email: user.email,
                role: user.role,
                lastConnection: user.lastConnection
            }
            userDetails.push(details)
        })
        
        res.send({success: true, payload: userDetails })
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Get user by email
usersRouter.get('/email', adminAuth, async (req, res) => {
    try {
        const email = req.body.email
        
        const user = await UserService.getUserByEmail(email)
        
        if (!user) {
            return res.send({success: false, error: 'User not found'})
        }
        
        return res.send({success: true, user})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})        
    }
})

//Delete inactive users
usersRouter.delete('/deleteUsers', adminAuth, async (req, res) => {
    try {
        const deletedUsers = await UserService.deleteInactiveUsers()
        
        res.send({success: true, deletedUsers})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }

})

//Get user by ID
usersRouter.get('/:uid', adminAuth, async (req, res) => {
    try {
        const uid = new mongoose.Types.ObjectId(req.params.uid)
        
        const user = await UserService.getUserByID(uid)
        
        if (!user) {
            return res.send({success: false, error: 'User not found'})
        }
        
        return res.send({success: true, user})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})        
    }
})

//Delete a user
usersRouter.delete('/:uid', adminAuth, async (req, res) => {
    try {
        const uid = new mongoose.Types.ObjectId(req.params.uid)
        
        const user = await UserService.getUserByID(uid)
        
        if (!user) {
            return res.send({success: false, error: 'User not found'})
        }

        const userToBeDeleted = await UserService.deleteUser(uid)
        
        res.send({success: true, userToBeDeleted})

    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Change user's role
usersRouter.post('/:uid', loginAuth, async (req, res) => {
    try {
        const uid = new mongoose.Types.ObjectId(req.params.uid)
        
        const user = await UserService.getUserByID(uid)
        
        if (!user) {
            return res.send({success: false, error: 'User not found'})
        }

        
        if (user.role === 'user') {
            const requiredDocuments = ['ID', 'ComprobanteDomicilio', 'EstadoCuenta']
    
            const matchingDocuments = user.documents.reduce((count, document) => {
                if (requiredDocuments.includes(document.fieldname)) {
                    count++
                }
                return count
            }, 0)

            if (matchingDocuments >= 3) {
                const newRole = await UserService.changeUserRole(uid)
                return res.send({success: true, newRole})
            } else {
                return res.send({success: false, error: 'Debes contar con los siguientes documentos: ID, Comprobante de Domicilio, Estado de Cuenta'}) 
            }            
        } else {
            const newRole = await UserService.changeUserRole(uid)
            return res.send({success: true, newRole})
        }

    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})        
    }
})

usersRouter.post('/:uid/documents', cpUpload, usersAuth, async (req, res) => {
    try {
        const uid = new mongoose.Types.ObjectId(req.params.uid)
        
        const user = await UserService.getUserByID(uid)
        
        if (!user) {
            return res.send({success: false, error: 'User not found'})
        }

        const files = []
        const fields = ['profileImage', 'productImage', 'ID', 'ComprobanteDomicilio', 'EstadoCuenta']

        fields.forEach(field => {
            if (req.files[field]) {
                files.push(...req.files[field])
            }
        });

        const document = []
        files.map(async file => {
            const name = file.originalname
            const reference = file.path
            const fieldname = file.fieldname
            
            document.push({name, reference, fieldname})
        })

        await UserService.uploadDocument(uid, document)
        
        res.send('Archivos subidos correctamente')
        
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'}) 
    }
})