import mongoose from 'mongoose';
import config from '../config/configDotenv.js'
import { keys } from '../keys.js';
import { logger } from '../config/logger.js';

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
        const connection = mongoose.connect(keys.mongoURI, {dbName: 'ecommerce'}, {useNewUrlParser: true, useUnifiedTopology: true,})
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