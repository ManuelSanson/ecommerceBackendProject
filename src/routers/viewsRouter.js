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

viewsRouter.get('/', auth, async (req, res) => {
    const products = await productModel.find().lean().exec()
    const user = req.session.user

    res.render('home', {products, user})
})

viewsRouter.get('/realTimeProducts', adminAuth, (req, res) => {
    res.render('realTimeProducts')
})

viewsRouter.get('/chat', auth, (req, res) => {
    res.render('liveChat')
})