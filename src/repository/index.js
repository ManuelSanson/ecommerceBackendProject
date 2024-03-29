import { Carts, Messages, Products, Users, Tickets } from '../dao1/factory.js';

import CartRepository from './cartsRepository.js';
import MessageRepository from './messagesRepository.js';
import ProductRepository from './productsRepository.js';
import UserRepository from './usersRepository.js';
import TicketRepository from './ticketsRepository.js';

export const CartService = new CartRepository(new Carts())
export const MessageService = new MessageRepository(new Messages())
export const ProductService = new ProductRepository(new Products())
export const UserService = new UserRepository(new Users())
export const TicketService = new TicketRepository(new Tickets())