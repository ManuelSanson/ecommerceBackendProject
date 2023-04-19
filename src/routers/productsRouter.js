import { Router } from 'express';
import productManager from '../DAO/file/productManager.js';
import { logger } from '../config/logger.js';

export const productsRouter = Router()

//GET all products
productsRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query

        const allProducts = await productManager.getProducts()

        if (limit && (!Number(limit) || limit < 0)) {
            // return res.send({success: false, error: 'Limit must be a valid number'})
            CustomError.createError({
                name: 'Products limit error',
                message: 'Limit must be a valid number',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        if (!limit || limit < 1) {
            return res.send({success: true, products: allProducts})
        }

        const products = allProducts.slice(0, limit)

        return res.send({success: true, payload: products})
    } catch (error) {
        logger.error(error);
        res.send({success: false, error: 'There is an error'})
    }
})

//GET products by ID
productsRouter.get('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            // return res.send({success: false, error: 'ID must be a valid number'})
            CustomError.createError({
                name: 'Get product by id error',
                message: 'ID must be a valid number',
                code: EErrors.INVALID_TYPES_ERROR
            })
            
        }
        
        const product = await productManager.getProductByID(id)
        
        if (!product) {
            // return res.send({success: false, error: 'Product not found'})
            CustomError.createError({
                name: 'Get product by id error',
                message: 'Product not found',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        
        return res.send({success: true, product})

    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//POST a new product
productsRouter.post('/', async (req, res) => {
    try {
        const {title, description, code, price, stock, category, thumbnails} = req.body

        if (!title || !description || !code || !price || !stock || !category) {
            // return res.send({success: false, error: 'These fields are required'})
            CustomError.createError({
                name: 'Product creation error',
                message: 'These fields are required',
                code: EErrors.INVALID_TYPES_ERROR
            })
        } 
        
        const addedProduct = await productManager.addProduct({title, description, code, price, stock, category, thumbnails})

        const products = await productManager.getProducts()

        req.get('io').socket.emit('products', products)

        res.send({success: true, product: addedProduct})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//PUT a new product
productsRouter.put('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            // return res.send({success: false, error: 'ID must be a valid number'})
            CustomError.createError({
                name: 'Get product by id error',
                message: 'ID must be a valid number',
                code: EErrors.INVALID_TYPES_ERROR
            })

        }

        const {title, description, code, price, status, stock, category, thumbnails} = req.body
        
        const updatedProduct = await productManager.updateProduct(id, {title, description, code, price, status, stock, category, thumbnails})

        res.send({success: true, product: updatedProduct})

    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//DELETE a product
productsRouter.delete('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            // return res.send({success: false, error: 'ID must be a valid number'})
            CustomError.createError({
                name: 'Get product by id error',
                message: 'ID must be a valid number',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        const deletedProduct = await productManager.deleteProduct(id)

        return res.send({success: true, deleted: deletedProduct})

    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})