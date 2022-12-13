import { Router } from 'express';
import { productManager } from '../Managers/index.js';

export const productsRouter = Router()

//GET all products
productsRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query

        const allProducts = await productManager.getProducts()

        if (limit && (!Number(limit) || limit < 0)) {
            return res.send({success: false, error: 'Limit must be a valid number'})
        }

        if (!limit || limit < 1) {
            return res.send({success: true, products: allProducts})
        }

        const products = allProducts.slice(0, limit)

        return res.send({success: true, products})
    } catch (error) {
        console.log(error);
        res.send({success: false, error: 'There is an error'})
    }
})

//GET products by ID
productsRouter.get('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            return res.send({success: false, error: 'ID must be a valid number'})
        }
        
        const product = await productManager.getProductByID(id)
        
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
productsRouter.post('/', async (req, res) => {
    try {
        const {title, description, code, price, status, stock, category, thumbnails} = req.body
        
        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.send({success: false, error: 'These fields are required'})
        } else {
            const addedProduct = await productManager.addProduct({title, description, code, price, status, stock, category, thumbnails})

            res.send({success: true, product: addedProduct})
        }
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//PUT a new product
productsRouter.put('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            return res.send({success: false, error: 'ID must be a valid number'})
        }

        const {title, description, code, price, status, stock, category, thumbnails} = req.body

        const updatedProduct = await productManager.updateProduct(id, {title, description, code, price, status, stock, category, thumbnails})
        res.send({success: true, product: updatedProduct})

    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//DELETE a product
productsRouter.delete('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            return res.send({success: false, error: 'ID must be a valid number'})
        }

        const deletedProduct = await productManager.deleteProduct(id)

        return res.send({success: true, deleted: deletedProduct})

    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})