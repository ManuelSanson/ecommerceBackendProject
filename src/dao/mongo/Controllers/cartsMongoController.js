import {cartModel} from '../models/cartModel.js'
import { productModel } from '../models/productModel.js'

export default class Carts {

    constructor() {}

    getCarts = async () => {
        const carts = await cartModel.find()

        return carts
    }

    getCartByID = async (cid) => {
        const cart = await cartModel.findOne({_id: cid}).populate("products._id").exec()

        return cart
    }

    addCart = async (data) => {
        await cartModel.create(data)

        return true
    }

    updateCart = async (cid, newData) => {
        const cartToReplace = newData
        const updatedCart = await cartModel.updateOne({_id: cid}, cartToReplace)
        
        return updatedCart
    }

    addProductToCart = async (cid, pid) => {
        const cart = await cartModel.findOne({_id: cid})

        let found = false
        for (let i = 0; i < cart.products.length; i++) {
            if ((cart.products[i]._id).toString() === pid.toString()) {
                cart.products[i].quantity++
                found = true
                break
            }            
        }

        if (!found) {
            const productFound = await productModel.findOne({_id: pid})
            if (productFound) {
                cart.products.push({_id: pid, quantity: 1})
            } else {
                console.log('Product not found');
            }
        }

        await cart.save()

        return cart
    }

    updateProductQuantity = async (cid, pid, quantity) => {
        const cart = await cartModel.findOne({_id: cid})
        const productFound = await productModel.findOne({_id: pid})
        
        productFound.quantity = quantity

        await cart.save()

        return cart
    }

    deleteProductFromCart = async (cid, pid) => {
        const cart = await cartModel.findOne({_id: cid})
        
        const productsNotDeleted = cart.products.filter(p => (p._id).toString() !== pid.toString())

        cart.products = productsNotDeleted

        await cart.save()

        return cart
    }

    deleteAllProductsFromCart = async (cid) => {
        const cart = await cartModel.findOne({_id: cid})

        cart.products = []

        await cart.save()

        return cart
    }

}