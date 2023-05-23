import { Router } from "express";
import mongoose from "mongoose";
import { logger } from '../config/logger.js';
import { ProductService } from "../repository/index.js";
import { premiumUserAdminAuth } from "../middlewares/authorizations.js";
import config from "../config/config.js";
import nodemailer from 'nodemailer';

export const productsRouter = Router()

//Get all products
productsRouter.get('/', async (req, res) => {
    try {
        const products = await ProductService.getProducts()

        res.send({success: true, payload: products })
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Get a product by ID
productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)

        const product = await ProductService.getProductByID(pid)

        if (!product) {
            return res.send({success: false, error: 'Product not found'})
        }

        return res.send({success: true, product})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Create a product
productsRouter.post('/', premiumUserAdminAuth, async (req, res) => {
    try {
        const user = req.session.user
        const {title, description, code, price, stock, category, thumbnails} = req.body

        if (!title || !description || !code || !price || !stock || !category) {
            return res.send({success: false, error: 'These fields are required'})
        }        
        
        const products = await ProductService.getProducts()
        const newProduct = {title, description, code, price, stock, category, thumbnails}
        
        if (user.role === 'premium') {
            newProduct.owner = user.email
        }
        
        const existsCodeInProduct = products.some(p => p.code === newProduct.code)
        
        if (existsCodeInProduct) {
            return res.send({success: false, error: 'Code cannot be repeated'})
        }
        
        
        await ProductService.addProduct(newProduct)
        
        return res.send({success: true, newProduct})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Update a product
productsRouter.put('/:pid', premiumUserAdminAuth, async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        const productToReplace = req.body   
        const user = req.session.user

        const productToBeReplaced = await ProductService.getProductByID(pid)
        
        if (user.role === 'premium') {
            if (productToBeReplaced[0].owner === user.email) {
                const updatedProduct = await ProductService.updateProduct(pid, productToReplace)
                res.send({success: true, updatedProduct})
            } else {
                res.send("No eres el owner de este producto, no puedes actualizarlo")
            }
        }

        if (user.role === 'admin') {
            const updatedProduct = await ProductService.updateProduct(pid, productToReplace)
            res.send({success: true, updatedProduct})
        }


        
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

//Delete a product
productsRouter.delete('/:pid', premiumUserAdminAuth, async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params.pid)
        const user = req.session.user

        const productToBeDeleted = await ProductService.getProductByID(pid)

        if (productToBeDeleted[0].owner !== 'admin') {

            if (user.role === 'premium') {
                if (productToBeDeleted[0].owner !== user.email) {
                    res.send("No eres el owner de este producto, no puedes eliminarlo")
                    return
                }
            }

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
            });
        
            const mailOptions = {
                from: config.mailUser,
                to: productToBeDeleted[0].owner,
                subject: 'Producto eliminado',
                html: `
                <p>Tu producto ${productToBeDeleted[0].title} ha sido eliminado</p>
                `,
            };
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(error);
                }
                logger.info('Email sent: ' + info.response);
            });
        }
        
        if (user.role === 'premium') {
            if (productToBeDeleted[0].owner === user.email) {
                const deletedProduct = await ProductService.deleteProduct(pid)
                res.send({success: true, deletedProduct})
            } else {
                res.send("No eres el owner de este producto, no puedes eliminarlo")
            }
        }

        if (user.role === 'admin') {
            const deletedProduct = await ProductService.deleteProduct(pid)
            res.send({success: true, deletedProduct})
        }
        
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})