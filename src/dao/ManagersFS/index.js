import { ProductManager } from "./ProductManager.js";
import { CartManager } from "./CartManager.js";
import { MessageManager } from "./MessageManager.js";
import { UserManager } from "./UserManager.js";

export const productManager = new ProductManager('./src/db/products.json')
export const cartManager = new CartManager('./src/db/carts.json')
export const messageManager = new MessageManager('./src/db/messages.json')
export const userManager = new UserManager('./src/db/users.json')