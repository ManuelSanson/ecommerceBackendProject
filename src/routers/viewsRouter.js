import { Router } from 'express';
import { productManager } from '../Managers/index.js'

export const viewsRouter = Router()

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts()

    res.render('home', {products})
})

viewsRouter.get('/realTimeProducts', async (req, res) => {
    
    res.render('realTimeProducts')
})