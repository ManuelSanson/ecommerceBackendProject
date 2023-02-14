import { Router } from 'express';
import { productModel } from '../dao/models/productModel.js';

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
        lean: true
    }

    //const products = await productModel.find().lean().exec()
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

viewsRouter.get('/realTimeProducts', adminAuth, (req, res) => {
    res.render('realTimeProducts')
})

viewsRouter.get('/chat', auth, (req, res) => {
    res.render('liveChat')
})