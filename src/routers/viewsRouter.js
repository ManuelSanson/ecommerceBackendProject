import { Router } from 'express';
import { productManager } from '../dao/ManagersFS/index.js'

export const viewsRouter = Router()

const auth = (req, res, next) => {
    if (req.session?.user) return next()

    return res.status(401).send(`Auth error. Debes <a href="/session/login">iniciar sesión</a>`)
}

const adminAuth = (req, res, next) => {
    if (req.session.role == 'admin') return next()

    return res.status(401).send(`Auth error. Solo los admin puede ver esta seccion`)
}

viewsRouter.get('/', auth, async (req, res) => {
    const products = await productManager.getProducts()

    res.render('home', {products})
})

viewsRouter.get('/realTimeProducts', adminAuth, (req, res) => {
    
    res.render('realTimeProducts')
})

viewsRouter.get('/chat', auth, (req, res) => {
    
    res.render('liveChat')
})