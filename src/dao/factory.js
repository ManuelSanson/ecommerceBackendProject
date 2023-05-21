import mongoose from 'mongoose';
import { logger } from '../config/logger.js';
import config from '../config/config.js';

export let Carts
export let Products
export let Users
export let Messages
export let Tickets

switch (config.persistence) {
    case 'FILE':
        logger.info('FS persitence');
        const { default: CartsFile} = await import('../DAO/file/cartManager.js')
        Carts = CartsFile
        const { default: ProductsFile} = await import('../DAO/file/productManager.js')
        Products = ProductsFile
        const { default: UsersFile} = await import('../DAO/file/userManager.js')
        Users = UsersFile
        const { default: MessagesFile} = await import('../DAO/file/messageManager.js')
        Messages = MessagesFile
        const { default: TicketsFile} = await import('../DAO/file/ticketManager.js')
        Tickets = TicketsFile
        break;
    default:
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
        break; 
}