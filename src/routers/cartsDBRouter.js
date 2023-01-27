import { Router } from 'express';
import mongoose from 'mongoose';
import { cartModel } from '../dao/models/cartModel.js';
import { productModel } from '../dao/models/productModel.js';

export const cartsDBRouter = Router()

//GET all carts
cartsDBRouter.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find()
        res.send({success: true, carts})
    } catch (error) {
        console.log(error);
        res.send({success: false, error: 'There is an error'})
    }
})

//GET cart by ID
cartsDBRouter.get('/:id', async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id)
        
        const cart = await cartModel.find({_id: id})
        
        if (!cart) {
            return res.send({success: false, error: 'Cart not found'})
        }
        
        return res.send({success: true, cart})

    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})


//POST a cart
cartsDBRouter.post('/', async (req, res) => {
    try {
        const products = []
        const carts = await cartModel.find()
        const newCart = {products}

        newCart.id = !carts.length ? 1 : Number(carts[carts.length - 1].id) + 1
        
        await cartModel.create(newCart)

        res.send({success: true, newCart})        
    } catch (error) {
        console.log(error);
        res.send({success: false, error: 'There is an error'})
    }
})

//PUT a new cart
cartsDBRouter.put('/:id', async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id)

        const cartToReplace = req.body

        const updatedCart = await cartModel.updateOne({_id: id}, cartToReplace)

        res.send({success: true, cart: updatedCart})

    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Add product to cart
cartsDBRouter.post('/:cid/product/:pid', async (req, res) => { 
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)

        const cartFound = await cartModel.find({_id: cid})
        
        const productFound = await productModel.find({_id: pid})

        if (!cartFound) {
            return res.send({success: false, error: 'Cart not found'})
        }
        
        if (!productFound) {
            return res.send({success: false, error: 'Product not found'})
        }
        
        let found = false
        for (let i = 0; i < cartFound[0].products.length; i++) {
            if (cartFound[0].products[i].id == productFound[0].id) {
                cartFound[0].products[i].quantity++
                found = true
                break
            }            
        }

        if (!found) {
            cartFound[0].products.push({id: productFound[0].id, quantity: 1})
        }
        
        await cartFound[0].save()

        return res.send({success: true, cartFound})
    } catch (error) {
        console.log(error);
        res.send({success: false, error: 'There is an error'})
    }
})