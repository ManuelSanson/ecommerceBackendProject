import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js'
import { Server as HttpServer } from 'http';
import { Server as ioServer } from 'socket.io';
import { cartsRouter } from './routers/cartsRouter.js';
import { productsRouter } from './routers/productsRouter.js';
import { viewsRouter } from './routers/viewsRouter.js';
import { sessionRouter } from './routers/sessionsRouter.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passportConfig.js';
import { logger } from './config/logger.js';
import { resetPasswordRouter } from './routers/resetPasswordRouter.js';
import config from './config/config.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { MessageService, ProductService } from './repository/index.js';
import { loginAuth } from './middlewares/authorizations.js';
import { usersRouter } from './routers/usersRouter.js';
import methodOverride from 'method-override';
import mongoose from 'mongoose';

const app = express()
const httpServer = new HttpServer(app)
const io = new ioServer(httpServer)

app.use(session({
    secret: 'manuel',
    store: MongoStore.create({
        mongoUrl: config.mongoURI,
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
app.use(methodOverride('_method'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs'
}))

const hbs = handlebars.create({});

hbs.handlebars.registerHelper('calculateTotal', function(price, quantity) {
    return price * quantity;
})

hbs.handlebars.registerHelper('calculateCartTotal', function(cartItems) {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
    total += cartItems[i]._id.price * cartItems[i].quantity;
    }
    return total;
})

app.use(express.static('public/'))

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.set('io', io)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const specs = swaggerJSDoc({
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion del proyecto",
            description: "Documentacion detallada"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
})

logger.info('Mongo connection');
mongoose.set('strictQuery', false)
mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true,dbName: config.mongoDBname}, error => {
    if (error) {
        logger.fatal('Cannot connect to db', error);
        process.exit()
    }
})

//Routers
app.use('/', viewsRouter)
app.use('/session', sessionRouter)
app.use('/api/carts/', loginAuth, cartsRouter)
app.use('/api/products/', loginAuth, productsRouter)
app.use('/api/users/', usersRouter)
app.use('/resetPassword', resetPasswordRouter)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

httpServer.listen(config.port, "0.0.0.0", () => logger.info(`Server running on port ${config.port}`))

//Messages
let messages = []
io.on('connection', async (socket) => {
    logger.info(`New client connected, id: ${socket.id}`);

    const products = await ProductService.getProducts()
    
    io.sockets.emit('products', products)

    socket.on('addProduct', async (product) => {
        await ProductService.addProduct(product)
        await ProductService.create(product)
    })
    
    socket.on('deleteProduct', async (id) => {
        await ProductService.deleteProduct(id)
    })

    //Chat
    socket.on('message', async data => {
        messages.push(data) 
        io.emit('messageLogs', messages)
        await MessageService.createMessage(messages)
    })
    
    socket.on('authenticated', async user => {
        socket.broadcast.emit('newUser', user)
    })
})