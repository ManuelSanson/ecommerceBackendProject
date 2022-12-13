import express from 'express';
import { productsRouter, cartsRouter } from './routers/index.js';

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const PORT = 8080

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))