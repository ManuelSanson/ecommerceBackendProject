import { Router } from "express";
import passport from "passport";
import { logger } from '../config/logger.js';
import { CartService, UserService } from "../repository/index.js";

export const sessionRouter = Router()

//Login with google
sessionRouter.get('/login-google', passport.authenticate('google', {scope: ['email', 'profile']}), async (req, res) => {})

sessionRouter.get('/googlecallback', passport.authenticate('google', {failureRedirect: '/session/failedlogin'}), async (req, res) => {
    req.session.user = req.user

    await UserService.updateLastConnection(req.user._id)

    let cart = await CartService.getCartByUserId(req.user._id)

    if(!cart) {
        cart = await CartService.addCart({
            products: [],
            userId: req.user._id,
        })
    }

    res.redirect('/products')
})

//Choose how to login
sessionRouter.get('/logins', async (req, res) => {
    res.render('logins', {})
})

//Login with account
sessionRouter.post('/logins', passport.authenticate('login', {failureRedirect: '/session/failedlogin'}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send('Error en username y/o password')
    }

    req.session.user = req.user
    
    await UserService.updateLastConnection(req.user._id)

    let cart = await CartService.getCartByUserId(req.user._id)

    if(!cart) {
        cart = await CartService.addCart({
            products: [],
            userId: req.user._id,
        })
    }
    
    res.redirect('/products')
})

//Failed login
sessionRouter.get('/failedlogin', async (req, res) => {
    logger.error('failed strategy');
    res.render('login-registrationError')
})

//Logout
sessionRouter.get('/logout', async (req, res) => {
    req.session.user = req.user

    if (req.user) {
        await UserService.updateLastConnection(req.user._id)
    }

    req.session.destroy(err => {
        if (err) {
            res.send('No puede desloguearse')
        } else {
        res.redirect('/session/logins')
        }
    })
})

//Register
sessionRouter.get('/register', async (req, res) => {
    res.render('register', {})
})

sessionRouter.post('/create', passport.authenticate('register', {failureRedirect: '/session/failedregister'}), async (req, res) => {
    res.redirect('/session/logins')
})

//Failed register
sessionRouter.get('/failedregister', async (req, res) => {
    logger.error('failed strategy');
    res.render('login-registrationError')
})

//See user
sessionRouter.get('/current', async (req, res) => {
    const user = req.session.user
    if (!user) {
        res.send('No hay usuario logueado')
    }

    const userDetails = {
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        lastConnection: user.lastConnection
    }

    res.send(userDetails)
})