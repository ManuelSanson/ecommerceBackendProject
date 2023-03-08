import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js'
import { Server as HttpServer } from 'http';
import { Server as ioServer } from 'socket.io';
import { productsRouter, cartsRouter, viewsRouter, sessionRouter } from './routers/index.js';
import { productManager } from './dao/ManagersFS/index.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { productModel } from './dao/mongo/models/productModel.js';
import passport from 'passport';
import initializePassport from './config/passportConfig.js';
import {keys} from './keys.js'
import { cartsMongoRouter } from './routers/cartsMongoRouter.js';
import { productsMongoRouter } from './routers/productsMongoRouter.js';
import { Messages } from './dao/factory.js';

const app = express()
const httpServer = new HttpServer(app)
const io = new ioServer(httpServer)

app.use(session({
    secret: 'manuel',
    store: MongoStore.create({
        mongoUrl: keys.mongoURI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl:10000
    }),
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const auth = (req, res, next) => {
    if (req.session?.user) return next()

    return res.status(401).send(`Auth error. Debes <a href="/session/logins">iniciar sesión</a>`)
}

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs'
}))

app.use(express.static('public/'))

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.set('io', io)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.set('strictQuery', false)
mongoose.connect(keys.mongoURI, {dbName: 'ecommerce'}, error => {
    if (error) {
        console.error('Cannot connect to db', error);
        process.exit()
    }
    
    const PORT = 8080
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

//Routers
//app.use('/api/products/', productsRouter)
//app.use('/api/carts/', cartsRouter)
app.use('/', viewsRouter)
app.use('/session', sessionRouter)
app.use('/api/carts/', cartsMongoRouter)
app.use('/api/products/', productsMongoRouter)


//Messages
const messagesService = new Messages()
let messages = []
io.on('connection', async (socket) => {
    console.log(`New client connected, id: ${socket.id}`);

    const products = await productManager.getProducts()
    
    io.sockets.emit('products', products)

    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product)
        await productModel.create(product)
    })
    
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id)
    })

    //Chat
    socket.on('message', async data => {
        messages.push(data) 
        io.emit('messageLogs', messages)
        await messagesService.createMessage(messages)
    })
    
    socket.on('authenticated', async user => {
        socket.broadcast.emit('newUser', user)
    })
})