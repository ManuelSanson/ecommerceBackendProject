import CartDTO from '../dao1/dto/cartsDTO.js'

export default class CartRepository {

    constructor(dao) {
        this.dao = dao
    }

    getCarts = async () => {
        return await this.dao.getCarts()
    }

    getCartByID = async (cid) => {
        return await this.dao.getCartByID(cid)
    }

    getCartByUserId = async (userId) => {
        return await this.dao.getCartByUserId(userId)
    }

    addCart = async (data) => {
        const dataToInsert = new CartDTO(data)
        return await this.dao.addCart(dataToInsert)
    }

    updateCart = async (cid, newData) => {
        return await this.dao.updateCart(cid, newData)
    }

    addProductToCart = async (cid, pid) => {
        return await this.dao.addProductToCart(cid, pid)
    }

    updateProductQuantity = async (cid, pid, quantity) => {
        return await this.dao.updateProductQuantity(cid, pid, quantity)
    }

    deleteProductFromCart = async (cid, pid) => {
        return await this.dao.deleteProductFromCart(cid, pid)
    }

    deleteAllProductsFromCart = async (cid) => {
        return await this.dao.deleteAllProductsFromCart(cid)
    }

}