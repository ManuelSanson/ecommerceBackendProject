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
        
        const productInCart = cartFound.products.find(p => p.product === cartFound.product)
        
        const quantity = productInCart ? productInCart.quantity+1 : 1;

        console.log('productInCart', productInCart);
        console.log('cartFound.products', cartFound.products);

        if (productInCart) {
            cartFound.products = cartFound.products.filter(p => p.product !== productInCart.product)
            console.log(cartFound.products.filter(p => p.p !== productInCart.product)); 
        }

        const productToPush = {product, quantity}
        cartFound.products.push(productToPush)
        
        const newCarts = carts.filter(cart => cart.id !== cartFound.id)
        newCarts.push(cartFound)

        this.#writeFile(newCarts)

        return cartFound

    }
}