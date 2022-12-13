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

    async addProductToCart(cid, pid, productSelected) {
        const carts = await this.getCarts()
        const cartFound = await this.getCartByID(cid)
        const productByID = await productManager.getProductByID(pid)

        const product = Number(productByID.id)
        const quantity = Number(cartFound.products.length)+1

        const productToPush = {product, quantity}

        
        console.log(cartFound);
        //console.log(cartFound.products);
        
        if (!cartFound.products.length) {
            cartFound.products.push(productToPush)
        }

        console.log(cartFound);
        console.log(cartFound.products);
        carts.push(cartFound)

        await this.#writeFile(carts)

        return cartFound

    }
}