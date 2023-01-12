import mongoose from 'mongoose';

const cartCollection = 'products'

const cartSchema = new mongoose.Schema({
    "products": Array,
    "id": Number
})

export const cartModel = mongoose.model(cartCollection, cartSchema)