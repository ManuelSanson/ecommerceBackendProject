import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './__dirname.js'
import { Server as HttpServer } from 'http';
import { Server as ioServer } from 'socket.io';
import { productsRouter, cartsRouter, viewsRouter } from './routers/index.js';
import { productManager } from './dao/ManagersFS/index.js';
import mongoose from 'mongoose';

const app = express()
const httpServer = new HttpServer(app)
const io = new ioServer(httpServer)

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs'
}))

app.use(express.static('public/'))

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect('mongodb+srv://ManuelSanson:5hRX9r2eJXDzXO8f@cluster0.w3fwwwq.mongodb.net/?retryWrites=true&w=majority', {dbName: 'ecommerce'}, error => {
    if (error) {
        console.error('Cannot connect to db', error);
        process.exit()
    }
    
    const PORT = 8080
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/', viewsRouter)


io.on('connection', async (socket) => {
    console.log(`New client connected, id: ${socket.id}`);

    const products = await productManager.getProducts()
    
    io.sockets.emit('products', products)

    socket.on('addProduct', async (product) => {
        console.log(product);
        await productManager.addProduct(product)
    })
    
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id)
    })
})


//5hRX9r2eJXDzXO8f
//ManuelSanson