import { Router } from 'express';
import mongoose from 'mongoose';
import { productModel } from '../DAO/mongo/models/productModel.js';
import { logger } from '../config/logger.js';
import { CartService } from "../repository/index.js";
import { loginAuth, adminAuth, userAuth } from '../middlewares/authorizations.js'

export const viewsRouter = Router()

viewsRouter.get('/products', loginAuth, async (req, res) => {
    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    const field = req.query.query ? req.query.query.split(":")[0] : undefined
    const search = req.query.query ? req.query.query.split(":")[1] : undefined
    const sortingField = req.query.sortBy ? req.query.sortBy.split(":")[0] : undefined
    const order = req.query.sortBy ? req.query.sortBy.split(":")[1] : undefined

    const regex = new RegExp(search, 'i')
    const filter = search && field ? { [field]: regex } : {}
    
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

    const data = await productModel.paginate(filter, options)
    const user = req.session.user

    const front_pagination = []
    for (let i = 1; i <= data.totalPages; i++) {
        front_pagination.push({
            page: i,
            active: i == data.page
        })
    }

    res.render('home', {data, user, front: {pagination: front_pagination}})
})

viewsRouter.get('/cart/:cid', loginAuth, async (req, res) => {
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

viewsRouter.get('/realTimeProducts', adminAuth, (req, res) => {
    res.render('realTimeProducts')
})

viewsRouter.get('/chat', userAuth, (req, res) => {
    res.render('liveChat')
})