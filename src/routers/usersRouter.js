import { Router } from "express";
import mongoose from "mongoose";
import { logger } from '../config/logger.js';
import { UserService } from "../repository/index.js";
import { cpUpload } from "../config/multerConfig.js";

export const usersRouter = Router()

//Get all users
usersRouter.get('/', async (req, res) => {
    try {
        const users = await UserService.getAllUsers()
        res.send({success: true, payload: users })
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Get user by email
usersRouter.get('/email', async (req, res) => {
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

//Get user by ID
usersRouter.get('/:uid', async (req, res) => {
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

//Change user's role
usersRouter.post('/:uid', async (req, res) => {
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

usersRouter.post('/:uid/documents', cpUpload, async (req, res) => {
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