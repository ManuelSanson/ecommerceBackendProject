import { Router } from "express";
import mongoose from "mongoose";
import { logger } from '../config/logger.js';
import { UserService } from "../repository/index.js";

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

        const newRole = await UserService.changeUserRole(uid)
        
        return res.send({success: true, newRole})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})        
    }
})