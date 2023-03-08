import { Router } from "express";
import mongoose from "mongoose";
import { Products } from '../dao/factory.js';

export const productsMongoRouter = Router()

const productsService = new Products()

//Get all products
productsMongoRouter.get('/', async (req, res) => {
    try {
        const products = await productsService.getProducts()

        res.send({success: true, payload: products })
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Get a product by ID
productsMongoRouter.get('/:pid', async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)

        const product = await productsService.getProductByID(pid)

        if (!product) {
            return res.send({success: false, error: 'Product not found'})
        }

        return res.send({success: true, product})
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Create a product
productsMongoRouter.post('/', async (req, res) => {
    try {
        const {title, description, code, price, stock, category, thumbnails} = req.body

        if (!title || !description || !code || !price || !stock || !category) {
            return res.send({success: false, error: 'These fields are required'})
        } 

        const products = await productsService.getProducts()
        const newProduct = {title, description, code, price, stock, category, thumbnails}
        
        const existsCodeInProduct = products.some(p => p.code === newProduct.code)

        if (existsCodeInProduct) {
            return res.send({success: false, error: 'Code cannot be repeated'})
        }

        await productsService.addProduct(newProduct )
        
        return res.send({success: true, newProduct})
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a product
productsMongoRouter.put('/:pid', async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)

        const productToReplace = req.body    
        const updatedProduct = await productsService.updateProduct(pid, productToReplace)

        res.send({success: true, updatedProduct})
        
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete a product
productsMongoRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        
        const deletedProduct = await productsService.deleteProduct(pid)

        res.send({success: true, deletedProduct})
        
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})