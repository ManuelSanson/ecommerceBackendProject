import { Router } from "express";
import userModel from "../dao/models/userModel.js";

export const sessionRouter = Router()

sessionRouter.get('/login', async (req, res) => {
    res.render('login', {})
})

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({email, password}).lean().exec()

    if (!user) {
        return res.send('Error en username y/o password')
    }

    req.session.user = user

    // if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    //     res.redirect('/realTimeProducts')
    // }
    //req.session.rol = (username == 'admin') ? 'admin' : 'user'

    res.redirect('/')

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

sessionRouter.post('/create', async (req, res) => {
    const newUser = req.body

    const user = new userModel(newUser)
    await user.save()

    res.redirect('/session/login')
})