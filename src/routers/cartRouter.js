import { Router } from 'express';
import { cartManager, productManager } from '../Managers/index.js'

export const cartsRouter = Router()

//GET all carts
cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.send({success: true, carts})
    } catch (error) {
        console.log(error);
        res.send({success: false, error: 'There is an error'})
    }
})

//GET cart by ID
cartsRouter.get('/:id', async (req, res) => {
    try {
        const {id: paramID} = req.params
        const id = Number(paramID)

        if (Number.isNaN(id) || id < 0) {
            return res.send({success: false, error: 'ID must be a valid number'})
        }
        
        const cart = await cartManager.getCartByID(id)
        
        if (!cart) {
            return res.send({success: false, error: 'Cart not found'})
        }
        
        return res.send({success: true, cart})

    } catch (error) {
        console.log(error);
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
        console.log(error);
        res.send({success: false, error: 'There is an error'})
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
            return res.send({success: false, error: 'ID must be a valid number'})
        }
        
        if (!cartFound) {
            return res.send({success: false, error: 'Cart not found'})
        }
        
        if (!product) {
            return res.send({success: false, error: 'Product not found'})
        }

        
        const productToCart = await cartManager.addProductToCart(cid, pid, product)

        return res.send({success: true, productToCart})
    } catch (error) {
        console.log(error);
        res.send({success: false, error: 'There is an error'})
    }
})
