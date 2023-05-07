import mongoose from 'mongoose';
import { CartService } from '../../repository/index.js';
import chai from 'chai';
import config from '../../config/config.js';

mongoose.connect(config.mongoURI, {dbName: 'tests'})
const expect = chai.expect

describe('Test CRUD of Cart Service', () => {

    before(async function() {
        await mongoose.connection.collections.carts.drop()
    })

    it('Must return an empty array if there are not any carts', async () => {
        const result = await CartService.getCarts()

        expect(result).to.be.deep.equal([])
    })

    it('Must create an empty cart', async () => {
        const data = {products: []}
        
        const result = await CartService.addCart(data)

        expect(result).to.include(data.products)
    })

    it('Must update a product', async () => {
        const cart = await CartService.addCart({products: [{"_id": "63c8a33fd21eb00c8e4ddd49", "quantity": 2}]})

        const result = await CartService.updateCart(cart._id, {products: [{"_id": "63c8a33fd21eb00c8e4ddd49", "quantity": 3}]})
        
        expect(result.modifiedCount).to.be.deep.equal(1)
    })

    it('Must delete a product', async () => {
        const cart = await CartService.addCart({products: [{"_id": "63c8a33fd21eb00c8e4ddd48", "quantity": 3}]})

        const result = await CartService.deleteAllProductsFromCart(cart._id)

        expect(result.products).to.be.deep.equal([])
    })

})