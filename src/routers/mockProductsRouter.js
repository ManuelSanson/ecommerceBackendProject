import { Router } from "express";
import { generateProduct } from "../utils.js";

export const mockProductsRouter = new Router()

mockProductsRouter.get('/', async (req, res) => {
    try {
        const products = []

        for (let i = 0; i <= 100; i++) {
            products.push(generateProduct())
            
        }
    
        res.send({status: 'success', payload: products})
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})
