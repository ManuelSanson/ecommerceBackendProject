import mongoose from 'mongoose';

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    "code": {type: String, unique: true},
    "purchaseDateTime": Date,
    "status": Boolean,
    "amount": Number,
    "purchase": String,
    "id": mongoose.SchemaTypes.ObjectId
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)