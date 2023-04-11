import { Router } from "express";
import { generateProduct } from "../utils.js";
import { logger } from '../config/logger.js';

export const mockProductsRouter = new Router()

mockProductsRouter.get('/', async (req, res) => {
    try {
        const products = []

        for (let i = 0; i <= 100; i++) {
            products.push(generateProduct())
            
        }
    
        res.send({status: 'success', payload: products})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})
