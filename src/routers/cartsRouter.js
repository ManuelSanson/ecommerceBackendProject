import { Router } from "express";
import mongoose from "mongoose";
import { logger } from '../config/logger.js';
import { CartService } from "../repository/index.js";
import { userAuth } from "../middlewares/authorizations.js"

export const cartsRouter = Router()

//Get all carts
cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await CartService.getCarts()
        res.send({success: true, payload: carts })
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
    
})

//Get carty by ID
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        
        const cart = await CartService.getCartByID(cid)
        
        if (!cart) {
            return res.send({success: false, error: 'Cart not found'})
        }
        
        return res.send({success: true, cart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})        
    }
})

//Create a new cart
cartsRouter.post('/', async (req, res) => {
    try {
        const products = []
        const newCart = {products}

        await CartService.addCart(newCart)

        res.send({success: true, newCart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a cart
cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)

        const cartToReplace = req.body    
        const updatedCart = await CartService.updateCart(cid, cartToReplace)

        res.send({success: true, updatedCart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
    
})

//Add a product to a cart
cartsRouter.post('/:cid/product/:pid', userAuth, async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)

        const productToCart = await CartService.addProductToCart(cid, pid)

        res.send({success: true, productToCart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a product's quantity
cartsRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        const {quantity} = req.body
        
        const updatedProductQuantity = await CartService.updateProductQuantity(cid, pid, quantity)
    
        res.send({success: true, updatedProductQuantity})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete a product from a cart
cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        
        const deletedProduct = await CartService.deleteProductFromCart(cid, pid)
    
        res.send({success: true, deletedProduct})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete all products from a cart
cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        
        const deletedProducts = await CartService.deleteAllProductsFromCart(cid)
    
        res.send({success: true, deletedProducts})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

