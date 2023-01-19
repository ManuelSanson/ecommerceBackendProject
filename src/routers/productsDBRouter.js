import { Router } from 'express';
import mongoose from 'mongoose';
import { productModel } from '../dao/models/productModel.js'

export const productsDBRouter = Router()

//GET all products
productsDBRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query

        const allProducts = await productModel.find()

        if (limit && (!Number(limit) || limit < 0)) {
            return res.send({success: false, error: 'Limit must be a valid number'})
        }

        if (!limit || limit < 1) {
            return res.send({success: true, products: allProducts.slice(0, 10)})
        }

        const products = allProducts.slice(0, limit)

        return res.send({success: true, payload: products})
    } catch (error) {
        console.log(error);
        res.send({success: false, error: 'There is an error'})
    }
})

//GET products by ID
productsDBRouter.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        
        const singleProduct = await productModel.find({_id: id})
        
        const product = singleProduct[0]
        
        if (!product) {
            return res.send({success: false, error: 'Product not found'})
        }
        
        return res.send({success: true, product})

    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//POST a new product
productsDBRouter.post('/', async (req, res) => {
    try {
        
        const addedProduct = await productModel.create(req.body)

        res.send({success: true, product: addedProduct})
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//PUT a new product
productsDBRouter.put('/:id', async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id)

        const productToReplace = req.body

        const updatedProduct = await productModel.updateOne({_id: id}, productToReplace)

        res.send({success: true, product: updatedProduct})

    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//DELETE a product
productsDBRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const deletedProduct = await productModel.deleteOne({_id: id})

        return res.send({success: true, deleted: deletedProduct})

    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})