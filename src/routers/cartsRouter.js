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
        const newCart = {products, userId: req.session.user._id}

        await CartService.addCart(newCart)

        res.send({success: true, newCart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a cart
cartsRouter.put('/:cid', usersAuth, async (req, res) => {
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
                if (productToBeAdded[0].stock >= 1){
                    await CartService.addProductToCart(cid, pid)
                    res.redirect('/cart')
                } else {
                    res.render('nostock')
                }
            }
        }

        if (user.role === 'user') {
            if (productToBeAdded[0].stock >= 1){
                await CartService.addProductToCart(cid, pid)

                res.redirect('/cart')
            } else {
                res.render('nostock')
            }
        }

        
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a product's quantity
cartsRouter.put('/:cid/product/:pid', usersAuth, async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        const {quantity} = req.body
        const product = await ProductService.getProductByID(pid)

        if (product[0].stock > quantity) {
            await CartService.updateProductQuantity(cid, pid, quantity)
            
            res.redirect('/cart')
        } else {
            res.render('nostock')
        }
        
    
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete a product from a cart
cartsRouter.delete('/:cid/product/:pid', usersAuth, async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        
        await CartService.deleteProductFromCart(cid, pid)
    
        res.redirect('/cart')
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete all products from a cart
cartsRouter.delete('/:cid', usersAuth, async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        
        await CartService.deleteAllProductsFromCart(cid)
    
        res.redirect('/cart')
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Purchase
cartsRouter.post('/:cid/purchase', usersAuth, async (req, res) => {
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
        <p>Tu compra en Funko Store por USD ${totalPrice} ha sido confirmada</p>
        `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error)
        }
        logger.info('Email sent: ' + info.response)
    })

    await CartService.deleteAllProductsFromCart(cid)

    res.render('successfulPurchase', {purchaseTicket})
})