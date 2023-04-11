import fs from 'fs';
import { logger } from '../../config/logger.js';

export class ProductManager {
    
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
            logger.error(error);
        }
    }

    #writeFile(data) {
        fs.promises.writeFile(this.path, JSON.stringify(data, null, 3))
    }

    async getProducts() {
        const response = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(response)
    }

    async getProductByID(id) {
        const products = await this.getProducts()

        const productFound = products.find(product => Number(product.id) === id)
        return productFound
    }

    async addProduct({title, description, code, price, stock, category, thumbnails}) {
        const newProduct = {title, description, code, price, stock, category, thumbnails}

        const products = await this.getProducts()

        const existsCodeInProduct = products.some(p => p.code === code)

        if (existsCodeInProduct) {
            return {error: 'Code cannot be repeated'}
        }

        newProduct.id = !products.length ? 1 : Number(products[products.length - 1].id) + 1
        newProduct.status = true

        products.push(newProduct)

        await this.#writeFile(products)

        return newProduct
    }

    async updateProduct(id, newData) {
        const products = await this.getProducts()
        const productIndex = products.findIndex(product => Number(product.id) === id)

        if (productIndex === -1) {
            return {error: 'Product not found'}
        }

        const product = products[productIndex]
        
        products[productIndex] = { ...product, ...newData}

        await this.#writeFile(products)

        return products[productIndex]
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        const productIndex = products.findIndex(product => Number(product.id) === id)

        if (productIndex === -1) {
            return {error: 'Product not found'}
        }

        const deletedProducts = products.splice(productIndex, 1)

        await this.#writeFile(products)

        return deletedProducts[0]
    }

}