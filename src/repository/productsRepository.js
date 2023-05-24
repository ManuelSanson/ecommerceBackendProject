import ProductDTO from '../dao/dto/productsDTO.js';

export default class ProductRepository {

    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => {
        return await this.dao.getProducts()
    }

    getProductByID = async (pid) => {
        return this.dao.getProductByID(pid)
    }

    addProduct = async (data) => {
        const dataToInsert = new ProductDTO(data)
        return await this.dao.addProduct(dataToInsert)
    }

    updateProduct = async (pid, newData) => {
        return await this.dao.updateProduct(pid, newData)
    }

    deleteProduct = async (pid) => {
        return await this.dao.deleteProduct(pid)
    }

    paginate = async (filter, options) => {
        return await this.dao.paginate(filter, options)
    }
}