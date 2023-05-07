import mongoose from 'mongoose';
import { ProductService } from '../../repository/index.js';
import chai from 'chai';
import config from '../../config/config.js';
import { faker } from '@faker-js/faker';

mongoose.connect(config.mongoURI, {dbName: 'tests'})
const expect = chai.expect

describe('Test CRUD of Product Service', () => {

    before(async function() {
        await mongoose.connection.collections.products.drop()
    })

    it('Must return an empty array if there are not any products', async () => {
        const result = await ProductService.getProducts()

        expect(result).to.be.deep.equal([])
    })

    it('Must create a product', async () => {
        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: Number(faker.commerce.price(undefined, undefined, 0)),
            status: true,
            stock: Number(faker.random.numeric(1)),
            category: faker.commerce.department(),
            thumbnails: faker.image.image()
        }
        const result = await ProductService.addProduct(product)

        expect(result).to.include(product)
    })

    it('Must update a product', async () => {
        const product = await ProductService.addProduct({
            title: "Celular",
            description: faker.commerce.productDescription(),
            price: Number(faker.commerce.price(undefined, undefined, 0)),
            status: true,
            stock: Number(faker.random.numeric(1)),
            category: faker.commerce.department(),
            thumbnails: faker.image.image()
        })

        const result = await ProductService.updateProduct(product._id, {
            title: "Telefno",
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            status: true,
            stock: faker.random.numeric(1),
            category: faker.commerce.department(),
            image: faker.image.image()
        })

        expect(result.modifiedCount).to.be.deep.equal(1)
    })

    it('Must delete a product', async () => {
        const product = await ProductService.addProduct({
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: Number(faker.commerce.price(undefined, undefined, 0)),
            status: true,
            stock: Number(faker.random.numeric(1)),
            category: faker.commerce.department(),
            thumbnails: faker.image.image()
        })

        const result = await ProductService.deleteProduct(product._id)

        expect(result.deletedCount).to.be.deep.equal(1)
    })

})
