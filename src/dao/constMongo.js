import mongoose from 'mongoose';
import { logger } from '../config/logger.js';
import config from '../config/config.js';

// export const Carts = await import('../DAO/mongo/cartsMongo.js')
// export const Products = await import('../DAO/mongo/productsMongo.js')
// export const Users = await import('../DAO/mongo/usersMongo.js')
// export const Messages = await import('../DAO/mongo/messagesMongo.js')
// export const Tickets = await import('../DAO/mongo/ticketsMongo.js')

export let Carts
export let Products
export let Users
export let Messages
export let Tickets

logger.info('Mongo connection');
mongoose.set('strictQuery', false)
mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true,dbName: config.mongoDBname}, error => {
    if (error) {
        logger.fatal('Cannot connect to db', error);
        process.exit()
    }
})


const { default: CartsMongo} = await import('../DAO/mongo/cartsMongo.js')
Carts = CartsMongo
const { default: ProductsMongo} = await import('../DAO/mongo/productsMongo.js')
Products = ProductsMongo
const { default: UsersMongo} = await import('../DAO/mongo/usersMongo.js')
Users = UsersMongo
const { default: MessagesMongo} = await import('../DAO/mongo/messagesMongo.js')
Messages = MessagesMongo
const { default: TicketsMongo} = await import('../DAO/mongo/ticketsMongo.js')
Tickets = TicketsMongo
