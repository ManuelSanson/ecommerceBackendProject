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
        const { default: CartsFile} = await import('../dao/file/cartManager.js')
        Carts = CartsFile
        const { default: ProductsFile} = await import('../dao/file/productManager.js')
        Products = ProductsFile
        const { default: UsersFile} = await import('../dao/file/userManager.js')
        Users = UsersFile
        const { default: MessagesFile} = await import('../dao/file/messageManager.js')
        Messages = MessagesFile
        const { default: TicketsFile} = await import('../dao/file/ticketManager.js')
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
        const { default: CartsMongo} = await import('../dao/mongo/cartsMongo.js')
        Carts = CartsMongo
        const { default: ProductsMongo} = await import('../dao/mongo/productsMongo.js')
        Products = ProductsMongo
        const { default: UsersMongo} = await import('../dao/mongo/usersMongo.js')
        Users = UsersMongo
        const { default: MessagesMongo} = await import('../dao/mongo/messagesMongo.js')
        Messages = MessagesMongo
        const { default: TicketsMongo} = await import('../dao/mongo/ticketsMongo.js')
        Tickets = TicketsMongo
        break; 
}