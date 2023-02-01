import { Router } from "express";
import passport from "passport";
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from '../utils.js';

export const sessionRouter = Router()

sessionRouter.get('/login', async (req, res) => {
    res.render('login', {})
})

sessionRouter.post('/login', passport.authenticate('/login', {failureRedirect: '/session/failedlogin'}), async (req, res) => {
    const { email } = req.body

    if (!req.user) {
        return res.status(400).send('Error en username y/o password')
    }

    req.session.user = req.user

    req.session.role = (email === 'adminCoder@coder.com') ? 'admin' : 'user'
    
    res.redirect('/')
})

sessionRouter.get('/failedlogin', async (req, res) => {
    console.log('failed strategy');
    res.send({error: 'Failed'})
})

sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.send('No puede loguearse')
        } else {
        res.redirect('/session/login')
        }
    })
})

sessionRouter.get('/register', async (req, res) => {
    res.render('register', {})
})

sessionRouter.post('/create', passport.authenticate('/register', {failureRedirect: '/session/failedregister'}), async (req, res) => {
    res.redirect('/session/login')
})

sessionRouter.get('/failedregister', async (req, res) => {
    console.log('failed strategy');
    res.send({error: 'Failed'})
})