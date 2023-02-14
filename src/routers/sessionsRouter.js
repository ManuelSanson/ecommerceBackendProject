import { Router } from "express";
import passport from "passport";

export const sessionRouter = Router()

//Choose how to login 
sessionRouter.get('/logins', async (req, res) => {
    res.render('logins', {})
})

//Login with google
sessionRouter.get('/login-google', passport.authenticate('google', {scope: ['email', 'profile']}), async (req, res) => {})

sessionRouter.get('/googlecallback', passport.authenticate('google', {failureRedirect: '/session/failedlogin'}), async (req, res) => {
    req.session.user = req.user

    req.session.role = (req.user?.email === 'adminCoder@coder.com') ? 'admin' : 'user'
    
    res.redirect('/products')
})

//Login with account
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
    
    res.redirect('/products')
})

//Failed login
sessionRouter.get('/failedlogin', async (req, res) => {
    console.log('failed strategy');
    res.send({error: 'Failed'})
})

//Logout
sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.send('No puede loguearse')
        } else {
        res.redirect('/session/logins')
        }
    })
})

//Register
sessionRouter.get('/register', async (req, res) => {
    res.render('register', {})
})

sessionRouter.post('/create', passport.authenticate('/register', {failureRedirect: '/session/failedregister'}), async (req, res) => {
    res.redirect('/session/login')
})

//Failed register
sessionRouter.get('/failedregister', async (req, res) => {
    console.log('failed strategy');
    res.send({error: 'Failed'})
})

//See user
sessionRouter.get('/current', async (req, res) => {
    const user = req.session.user
    if (!user) {
        res.send('No hay usuario logueado')
    }
    res.send(user)
})