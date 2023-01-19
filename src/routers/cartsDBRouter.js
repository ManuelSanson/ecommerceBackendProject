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
        const {id} = req.params
        
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
        const newCart = await cartModel.create(req.body)

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

        const updatedCart = await  cartModel.updateOne({_id: id}, cartToReplace)

        res.send({success: true, cart: updatedCart})

    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

cartsDBRouter.post('/:cid/product/:pid', async (req, res) => { 
    try {
        // const {cid: paramCID} = req.params
        // const cid = Number(paramCID)
        // const {pid: paramPID} = req.params
        // const pid = Number(paramPID)
        // const {cid} = req.params
        // const {pid} = req.params
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        // console.log({cid});
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        // console.log({pid});

        const cartFound = await await cartModel.find({_id: cid})
        // console.log({cartFound});
        
        
        const singleProduct = await productModel.find({_id: pid})
        
        const product = singleProduct[0]
        console.log({product}); 
        // if ((Number.isNaN(cid) || cid < 0) || (Number.isNaN(pid) || pid < 0)) {
        //     return res.send({success: false, error: 'ID must be a valid number'})
        // }
        
        if (!cartFound) {
            return res.send({success: false, error: 'Cart not found'})
        }
        
        if (!product) {
            return res.send({success: false, error: 'Product not found'})
        }

        //const productToCart = await cartManager.addProductToCart(cid, pid)
        console.log(1, cartFound[0].products);
        const productToCart = cartFound[0].products.push(product)
        console.log(2, cartFound[0].products);

        const updateCart = await cartModel.updateOne({_id: cid}, cartFound)


        return res.send({success: true, productToCart})
    } catch (error) {
        console.log(error);
        res.send({success: false, error: 'There is an error'})
    }
})