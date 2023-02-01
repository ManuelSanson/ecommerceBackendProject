import passport from 'passport';
import local from 'passport-local';
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from '../utils.js';

const localStrategy = local.Strategy

const initializePassport = () => {
    passport.use('/register', new localStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { firstName, lastName, email } = req.body
            try {
                const user = await userModel.findOne({email: username}).lean().exec()

                if (user) {
                    console.log('Ya existe un usuario registrado con este email');
                    return done(null, false)
                }
                
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    password: createHash(password)
                }

                const result = await userModel.create(newUser)

                return done(null, result)

            } catch (error) {
                return done('Error en el registro ' + error)
            }
        }
    ))

    passport.use('/login', new localStrategy(
        { usernameField: 'email' },
        async(username, password, done) => {
            try {
                const user = await userModel.findOne({email: username}).lean().exec()

                if (!user) {
                    console.log('No existe este usuario');
                    return done(null, false)
                }
                
                if (!isValidPassword(user, password)) {
                    return done(null, false)
                }

                return done(null, user)

            } catch (error) {
                return done('Error en login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport