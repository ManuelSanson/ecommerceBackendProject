import { Router } from 'express';
import { cartManager, productManager } from '../dao/ManagersFS/index.js'
import CustomError from '../services/errors/customError.js';
import { EErrors } from '../services/errors/enums.js';
import { logger } from '../config/logger.js';

export const cartsRouter = Router()

//GET all carts
cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.send({success: true, carts})
    } catch (error) {
        // console.log(error);
        // res.send({success: false, error: 'There is an error'})
        CustomError.createError({
            name: 'Get carts error',
            message: 'Error getting carts',
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
})

//GET cart by ID
cartsRouter.get('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            // return res.send({success: false, error: 'ID must be a valid number'})
            CustomError.createError({
                name: 'Get cart by id error',
                message: 'ID must be a valid number',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        
        const cart = await cartManager.getCartByID(id)
        
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


//POST a cart
cartsRouter.post('/', async (req, res) => {
    try {
        const products = []
        const newCart = await cartManager.addCart(products)
        res.send({success: true, newCart})
        
    } catch (error) {
        logger.error(error);
        res.send({success: false, error: 'There is an error'})
    }
})

//PUT a new cart
cartsRouter.put('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            // return res.send({success: false, error: 'ID must be a valid number'})
            CustomError.createError({
                name: 'Get cart by id error',
                message: 'ID must be a valid number',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        const cartToReplace = await cartManager.updateCart(id, cartToReplace)

        res.send({success: true, product: cartToReplace})

    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => { 
    try {
        const {cid: paramCID} = req.params
        const cid = Number(paramCID)
        const {pid: paramPID} = req.params
        const pid = Number(paramPID)

        const cartFound = await cartManager.getCartByID(cid)
        const product = await productManager.getProductByID(pid)
                
        if ((Number.isNaN(cid) || cid < 0) || (Number.isNaN(pid) || pid < 0)) {
            // return res.send({success: false, error: 'ID must be a valid number'})
            CustomError.createError({
                name: 'Get cart by id error',
                message: 'ID must be a valid number',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        
        if (!cartFound) {
            // return res.send({success: false, error: 'Cart not found'})
            CustomError.createError({
                name: 'Get cart by id error',
                message: 'Cart not found',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        
        if (!product) {
            // return res.send({success: false, error: 'Product not found'})
            CustomError.createError({
                name: 'Get product by id error',
                message: 'Product not found',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        const productToCart = await cartManager.addProductToCart(cid, pid)

        return res.send({success: true, productToCart})
    } catch (error) {
        logger.error(error);
        res.send({success: false, error: 'There is an error'})
    }
})
