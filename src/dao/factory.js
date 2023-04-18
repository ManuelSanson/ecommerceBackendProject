import mongoose from 'mongoose';
import { logger } from '../config/logger.js';
import config from '../config/config.js';

export let Carts
export let Products
export let Users
export let Messages

switch (config.persistence) {
    case 'MEMORY':
        logger.info('Memory persistence');
        const { default: CartsMemory} = await import('./memory/cartsMemoryController.js')
        Carts = CartsMemory
        const { default: ProductsMemory} = await import('./memory/productsMemoryController.js')
        Products = ProductsMemory
        const { default: UsersMemory} = await import('./memory/usersMemoryController.js')
        Users = UsersMemory
        const { default: MessagesMemory} = await import('./memory/messagesMemoryController.js')
        Messages = MessagesMemory
        break;
    case 'FILE':
        logger.info('FS persitence');
        const { default: CartsFile} = await import('./ManagersFS/CartManager.js')
        Carts = CartsFile
        const { default: ProductsFile} = await import('./ManagersFS/ProductManager.js')
        Products = ProductsFile
        const { default: UsersFile} = await import('./ManagersFS/UserManager.js')
        Users = UsersFile
        const { default: MessagesFile} = await import('./ManagersFS/MessageManager.js')
        Messages = MessagesFile
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
        const { default: CartsMongo} = await import('./mongo/Controllers/cartsMongoController.js')
        Carts = CartsMongo
        const { default: ProductsMongo} = await import('./mongo/Controllers/productsMongoController.js')
        Products = ProductsMongo
        const { default: UsersMongo} = await import('./mongo/Controllers/usersMongoController.js')
        Users = UsersMongo
        const { default: MessagesMongo} = await import('./mongo/Controllers/messagesMongoController.js')
        Messages = MessagesMongo
        break; 
}