import { Router } from 'express';
import mongoose from 'mongoose';
import { productModel } from '../dao/mongo/models/productModel.js';
import { Carts } from '../dao/factory.js';

const cartsService = new Carts()

export const viewsRouter = Router()

const auth = (req, res, next) => {
    if (req.session?.user) return next()

    return res.status(401).send(`Auth error. Debes <a href="/session/logins">iniciar sesión</a>`)
}

const adminAuth = (req, res, next) => {
    if (req.session.role == 'admin') return next()

    return res.status(401).send(`Auth error. Solo los admin puede ver esta seccion`)
}

viewsRouter.get('/products', auth, async (req, res) => {
    const limit = req.query?.limit || 10
    const page = req.query?.page || 1

    const options = {
        limit,
        page,
        lean: true,
        // sortLowToHigh: {price: 1},
        // sortHighToLow: {price: -1}
    }

    const data = await productModel.paginate({}, options)
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

viewsRouter.get('/cart/:cid', auth, async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid)
        const cart = await cartsService.getCartByID(cid)

        const productsInCart = JSON.stringify(cart.products)
        
        res.render('cart', {cart, productsInCart})
    } catch (error) {
        console.log(error);
        return res.send({success: false, error: 'There is an error'})
    }
})

viewsRouter.get('/realTimeProducts', adminAuth, (req, res) => {
    res.render('realTimeProducts')
})

viewsRouter.get('/chat', auth, (req, res) => {
    res.render('liveChat')
})