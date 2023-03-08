import mongoose from 'mongoose';

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    "products": [{
        "_id": {type: mongoose.SchemaTypes.ObjectId, ref: "products"},
        "quantity": Number
    }],
    "id": mongoose.SchemaTypes.ObjectId,
})

export const cartModel = mongoose.model(cartCollection, cartSchema)