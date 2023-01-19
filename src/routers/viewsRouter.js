import { Router } from 'express';
import { productManager } from '../dao/ManagersFS/index.js'

export const viewsRouter = Router()

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts()

    res.render('home', {products})
})

viewsRouter.get('/realTimeProducts', (req, res) => {
    
    res.render('realTimeProducts')
})

viewsRouter.get('/chat', (req, res) => {
    
    res.render('liveChat')
})