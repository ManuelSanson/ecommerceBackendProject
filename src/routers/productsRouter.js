import { Router } from "express";
import mongoose from "mongoose";
import { logger } from '../config/logger.js';
import { ProductService } from "../repository/index.js";

export const productsRouter = Router()

//Get all products
productsRouter.get('/', async (req, res) => {
    try {
        const products = await ProductService.getProducts()

        res.send({success: true, payload: products })
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Get a product by ID
productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)

        const product = await ProductService.getProductByID(pid)

        if (!product) {
            return res.send({success: false, error: 'Product not found'})
        }

        return res.send({success: true, product})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Create a product
productsRouter.post('/', async (req, res) => {
    try {
        const {title, description, code, price, stock, category, thumbnails} = req.body

        if (!title || !description || !code || !price || !stock || !category) {
            return res.send({success: false, error: 'These fields are required'})
        } 

        const products = await ProductService.getProducts()
        const newProduct = {title, description, code, price, stock, category, thumbnails}
        
        const existsCodeInProduct = products.some(p => p.code === newProduct.code)

        if (existsCodeInProduct) {
            return res.send({success: false, error: 'Code cannot be repeated'})
        }

        await ProductService.addProduct(newProduct )
        
        return res.send({success: true, newProduct})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a product
productsRouter.put('/:pid', async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)

        const productToReplace = req.body    
        const updatedProduct = await ProductService.updateProduct(pid, productToReplace)

        res.send({success: true, updatedProduct})
        
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete a product
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        
        const deletedProduct = await ProductService.deleteProduct(pid)

        res.send({success: true, deletedProduct})
        
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})