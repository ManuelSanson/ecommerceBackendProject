import { Router } from "express";
import mongoose from "mongoose";
import { Carts } from '../dao/factory.js';
import CustomError from "../services/errors/customError.js";
import { EErrors } from "../services/errors/enums.js";
import {  } from '../config/logger.js';

export const cartsMongoRouter = Router()

const cartsService = new Carts()

//Get all carts
cartsMongoRouter.get('/', async (req, res) => {
    try {
        const carts = await cartsService.getCarts()
        res.send({success: true, payload: carts })
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
    
})

//Get carty by ID
cartsMongoRouter.get('/:cid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        
        const cart = await cartsService.getCartByID(cid)
        
        if (!cart) {
            // return res.send({success: false, error: 'Cart not found'})
            CustomError.createError({
                name: 'Get cart by id error',
                message: 'Cart not found',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        
        return res.send({success: true, cart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})        
    }
})

//Create a new cart
cartsMongoRouter.post('/', async (req, res) => {
    try {
        const products = []
        const newCart = {products}

        await cartsService.addCart(newCart)

        res.send({success: true, newCart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a cart
cartsMongoRouter.put('/:cid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)

        const cartToReplace = req.body    
        const updatedCart = await cartsService.updateCart(cid, cartToReplace)

        res.send({success: true, updatedCart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
    
})

//Add a product to a cart
cartsMongoRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)

        const productToCart = await cartsService.addProductToCart(cid, pid)

        res.send({success: true, productToCart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a product's quantity
cartsMongoRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        const {quantity} = req.body
    
        const updatedProductQuantity = await cartsService.updateProductQuantity(cid, pid, quantity)
    
        res.send({success: true, updatedProductQuantity})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete a product from a cart
cartsMongoRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        
        const deletedProduct = await cartsService.deleteProductFromCart(cid, pid)
    
        res.send({success: true, deletedProduct})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete all products from a cart
cartsMongoRouter.delete('/:cid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        
        const deletedProducts = await cartsService.deleteAllProductsFromCart(cid)
    
        res.send({success: true, deletedProducts})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

