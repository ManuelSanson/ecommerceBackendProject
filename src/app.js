import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js'
import { Server as HttpServer } from 'http';
import { Server as ioServer } from 'socket.io';
import { productsRouter, cartsRouter, viewsRouter, sessionRouter } from './routers/index.js';
import productManager from './DAO/file/productManager.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { productModel } from './DAO/mongo/models/productModel.js';
import passport from 'passport';
import initializePassport from './config/passportConfig.js';
import { cartsMongoRouter } from './routers/cartsMongoRouter.js';
import { productsMongoRouter } from './routers/productsMongoRouter.js';
import { Messages } from './DAO/factory.js';
import { mockProductsRouter } from './routers/mockProductsRouter.js';
import errorHandler from './middlewares/errors/errorsMiddleware.js';
import { logger } from './config/logger.js';
import { resetPasswordRouter } from './routers/resetPasswordRouter.js';
import config from './config/config.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

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

//Routers
//app.use('/api/products/', productsRouter)
//app.use('/api/carts/', cartsRouter)
app.use('/', viewsRouter)
app.use('/session', sessionRouter)
app.use('/api/carts/', cartsMongoRouter)
app.use('/api/products/', productsMongoRouter)
app.use('/mockingproducts/', mockProductsRouter)
app.use('/resetPassword', resetPasswordRouter)
app.use(errorHandler)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.get('/loggerTest', (req, res) => {
    logger.warning('This is a warning message.')
    logger.error('This is an error message.')
    logger.info('This is an info message.')
    logger.http('This is an http message.')
    logger.debug('This is a debug message.')
    logger.fatal('This is a fatal message.')

    res.send("Logs generated")
});

httpServer.listen(config.port, () => logger.info(`Server running on port ${config.port}`))

//Messages
const messagesService = new Messages()
let messages = []
io.on('connection', async (socket) => {
    logger.info(`New client connected, id: ${socket.id}`);

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