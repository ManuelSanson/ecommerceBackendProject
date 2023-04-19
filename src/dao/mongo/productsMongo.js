import { productModel } from '../mongo/models/productModel.js';

export default class Products {

    constructor() {}

    getProducts = async () => {
        const products = await productModel.find()

        return products
    }

    getProductByID = async (pid) => {
        const product = await productModel.find({_id: pid})

        return product
    }

    addProduct = async (data) => {
        await productModel.create(data)

        return true
    }

    updateProduct = async (pid, newData) => {
        const productToReplace = newData
        const updatedProduct = await productModel.updateOne({_id: pid}, productToReplace)
        
        return updatedProduct
    }

    deleteProduct = async (pid) => {
        await productModel.deleteOne({_id: pid})

        return true
    }
}