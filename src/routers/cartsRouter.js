import { Router } from "express";
import mongoose from "mongoose";
import { logger } from '../config/logger.js';
import { CartService, ProductService, TicketService } from "../repository/index.js";
import { usersAuth } from "../middlewares/authorizations.js";
import bcrypt from 'bcrypt';
import config from "../config/config.js";
import nodemailer from 'nodemailer';

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
cartsRouter.post('/:cid/product/:pid', usersAuth, async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        const user = req.session.user

        const productToBeAdded = await ProductService.getProductByID(pid)

        if (user.role === 'premium') {
            if (productToBeAdded[0].owner === user.email) {
                res.send("Eres el owner de este producto, no puedes agregarlo al carrito")
            } else {
                const productToCart = await CartService.addProductToCart(cid, pid)

                res.send({success: true, productToCart})
            }
        }

        if (user.role === 'user') {
            const productToCart = await CartService.addProductToCart(cid, pid)

            res.send({success: true, productToCart})
        }

        
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

//Purchase
cartsRouter.post('/:cid/purchase', async (req, res) => {
    const cid = new mongoose.Types.ObjectId(req.params.cid)

    const cart = await CartService.getCartByID(cid)
        
    if (!cart) {
        return res.send({success: false, error: 'Cart not found'})
    }

    const productsToUpdate = [];
    const productsNotAvailable = [];    

    for (const product of cart.products) {
        const foundProduct = await ProductService.getProductByID(product._id)

        if (foundProduct[0].stock >= product.quantity) {
            productsToUpdate.push({
            id: foundProduct[0]._id,
            stock: foundProduct[0].stock - product.quantity,
            });
        } else {
            productsNotAvailable.push(foundProduct[0]._id);
        }
    }

    if (productsNotAvailable.length === 0) {
        for (const product of productsToUpdate) {
            await ProductService.updateProduct(product.id, { stock: product.stock });
        }
    }

    if (productsNotAvailable.length > 0) {
        res.json({ success: false, productsNotAvailable });

        return
    }

    const user = req.session.user
    
    let total = []
    for (const product of cart.products) {
        const foundProduct = await ProductService.getProductByID(product._id)
        const result = foundProduct[0].price * product.quantity
        total.push(result)
    }

    const totalPrice = total.reduce((acc, val) => acc + val, 0)

    const purchaseTicket = await TicketService.createTicket({
        code: bcrypt.genSaltSync(10),
        purchaseDateTime: new Date(),
        amount: totalPrice,
        purchaser: user.email
    })

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        type: 'PLAIN',
        auth: {
            user: config.mailUser,
            pass: config.mailPass
        },
        tls: {
        rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from: config.mailUser,
        to: user.email,
        subject: 'Confirmación de compra',
        html: `
        <p>Gracias por tu compra</p>
        <p>Tu compra ha sido confirmada</p>
        `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error)
        }
        logger.info('Email sent: ' + info.response)
    })

    res.send(purchaseTicket)
})

