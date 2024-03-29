import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    "title": String,
    "description": String,
    "code": String,
    "price": Number,
    "status": Boolean,
    "stock": Number,
    "category": String,
    "thumbnails": String,
    "owner": {
        type: String,
        default: 'admin'
    }
})

productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model(productCollection, productSchema)