import { Router } from 'express';
import mongoose from 'mongoose';
import { logger } from '../config/logger.js';
import { CartService, ProductService } from "../repository/index.js";
import { adminAuth, loginAuth, usersAuth } from '../middlewares/authorizations.js'

export const viewsRouter = Router()

viewsRouter.get('/', (req, res) => {
    res.render('welcome')
})

viewsRouter.get('/products', loginAuth, async (req, res) => {
    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    const field = req.query.query ? req.query.query.split(":")[0] : undefined
    const search = req.query.query ? req.query.query.split(":")[1] : undefined
    const sortingField = req.query.sortBy ? req.query.sortBy.split(":")[0] : undefined
    const order = req.query.sortBy ? req.query.sortBy.split(":")[1] : undefined

    const regex = new RegExp(search, 'i')
    const filter = search && field ? { [field]: regex } : {}

    if(req.query.name) {
        const regex2 = new RegExp(req.query.name, 'i')
        filter.title = regex2
    }
    
    const sort = sortingField && order ? { [sortingField]: order === 'desc' ? -1 : 1 } : {}

    const options = {
        limit,
        page,
        lean: true,
        collation: {
            locale: 'en',
            strength: 2
        },
        sort
    }

    const data = await ProductService.paginate(filter, options)
    //await productModel.paginate(filter, options)
    const user = req.session.user
    
    const front_pagination = []
    for (let i = 1; i <= data.totalPages; i++) {
        front_pagination.push({
            page: i,
            active: i == data.page
        })
    }

    const cart = await CartService.getCartByUserId(req.user._id)

    res.render('home', {data, user, cart,  front: {pagination: front_pagination}})
})

viewsRouter.get('/cart/:cid', async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const cart = await CartService.getCartByID(cid)

        const productsInCart = JSON.stringify(cart.products)
        
        res.render('cart', {cart, productsInCart})
    } catch (error) {
        logger.error(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

viewsRouter.get('/cart', async (req, res) => {
    const user = req.session.user
    const cart = await CartService.getCartByUserId(req.user._id)
    
    
    res.render('cart', {user, cart})
})

viewsRouter.get('/realTimeProducts', adminAuth, (req, res) => {
    res.render('realTimeProducts')
})

viewsRouter.get('/chat', usersAuth, (req, res) => {
    res.render('liveChat')
})