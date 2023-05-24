import mongoose from 'mongoose';

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    "code": {type: String, unique: true},
    "purchaseDateTime": Date,
    "amount": Number,
    "purchaser": String,
    "id": mongoose.SchemaTypes.ObjectId
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)