import { ProductManager } from "./ProductManager.js";
import { CartManager } from "./CartManager.js";

export const productManager = new ProductManager('./src/db/products.json')
export const cartManager = new CartManager('./src/db/carts.json')