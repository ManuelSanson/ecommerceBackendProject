import mongoose from 'mongoose';
import { logger } from '../config/logger.js';
import config from '../config/config.js';
import CartsMongo from '../dao1/mongo/cartsMongo.js'

export let Carts
export let Products
export let Users
export let Messages
export let Tickets

switch (config.persistence) {
    case 'FILE':
        logger.info('FS persitence');
        const { default: CartsFile} = await import('../dao1/file/cartManager.js')
        Carts = CartsFile
        const { default: ProductsFile} = await import('../dao1/file/productManager.js')
        Products = ProductsFile
        const { default: UsersFile} = await import('../dao1/file/userManager.js')
        Users = UsersFile
        const { default: MessagesFile} = await import('../dao1/file/messageManager.js')
        Messages = MessagesFile
        const { default: TicketsFile} = await import('../dao1/file/ticketManager.js')
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
        //const { default: CartsMongo} = await import('../dao1/mongo/cartsMongo.js')
        Carts = CartsMongo
        const { default: ProductsMongo} = await import('../dao1/mongo/productsMongo.js')
        Products = ProductsMongo
        const { default: UsersMongo} = await import('../dao1/mongo/usersMongo.js')
        Users = UsersMongo
        const { default: MessagesMongo} = await import('../dao1/mongo/messagesMongo.js')
        Messages = MessagesMongo
        const { default: TicketsMongo} = await import('../dao1/mongo/ticketsMongo.js')
        Tickets = TicketsMongo
        break; 
}