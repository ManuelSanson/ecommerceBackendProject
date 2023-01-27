import mongoose from 'mongoose';

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    "products": [{
        "id": Number,
        "quantity": Number
    }],
    "id": Number,
})

export const cartModel = mongoose.model(cartCollection, cartSchema)