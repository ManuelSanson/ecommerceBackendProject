import fs from 'fs';
import { productManager } from './index.js';

export class CartManager {
    
    constructor(path) {
        this.path = path
        this.#init()
    }

    #init() {
        try {
            const existFile = fs.existsSync(this.path)
            if (existFile) {
                return
            } else {
                fs.writeFileSync(this.path, JSON.stringify([]))
            }
        } catch (error) {
            console.log(error);
        }
    }

    #writeFile(data) {
        fs.promises.writeFile(this.path, JSON.stringify(data, null, 3))
    }

    async getCarts() {
        const response = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(response)
    }

    async getCartByID(id) {
        const carts = await this.getCarts()

        const cartFound = carts.find(cart => Number(cart.id) === id)

        return cartFound
    }

    async addCart(products) {
        const carts = await this.getCarts()
        const newCart = {products}

        newCart.id = !carts.length ? 1 : Number(carts[carts.length - 1].id) + 1

        carts.push(newCart)

        await this.#writeFile(carts)

        return newCart
    }

    async updateCart(id, newData) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(cart => Number(cart.id) === id)

        if (cartIndex === -1) {
            return {error: 'Cart not found'}
        }

        const cart = carts[cartIndex]
        
        carts[cartIndex] = { ...cart, ...newData}

        await this.#writeFile(carts)

        return carts[cartIndex]
    }

    async addProductToCart(cid, pid) {
        const cart = await this.getCartByID(cid)

        let found = false
        for (let i = 0; i < cart.products.length; i++) {
            if (cart.products[i].id == pid) {
                cart.products[i].quantity++
                found = true
                break
            }            
        }

        if (!found) {
            cart.products.push({id: pid, quantity: 1})
        }

        await this.updateCart(cid, cart)

        return cart
    }
}