//import { Carts, Messages, Products, Users, Tickets } from '../DAO/factory.js';
//import { Carts, Messages, Products, Users, Tickets } from '../DAO/constMongo.js';
import CartRepository from './cartsRepository.js';
import MessageRepository from './messagesRepository.js';
import ProductRepository from './productsRepository.js';
import UserRepository from './usersRepository.js';
import TicketRepository from './ticketsRepository.js';

export let Carts
export let Products
export let Users
export let Messages
export let Tickets

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

export const CartService = new CartRepository(new Carts())
export const MessageService = new MessageRepository(new Messages())
export const ProductService = new ProductRepository(new Products())
export const UserService = new UserRepository(new Users())
export const TicketService = new TicketRepository(new Tickets())