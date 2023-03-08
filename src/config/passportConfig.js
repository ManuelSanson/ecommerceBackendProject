import passport from 'passport';
import local from 'passport-local';
//import userModel from "../dao/mongo/models/userModel.js";
import { Users } from '../dao/factory.js';
import { createHash, isValidPassword } from '../utils.js';
import { keys } from '../keys.js';
import GoogleStrategy from 'passport-google-oauth20';

const localStrategy = local.Strategy
const usersService = new Users()

const initializePassport = () => {

    passport.use('google', new GoogleStrategy(
        {
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: 'http://localhost:8080/session/googlecallback',
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                //const user = await userModel.findOne({email: profile._json.email})
                const user = await usersService.getUserByEmail(profile._json.email)

                if (user) {
                    console.log('Ya existe un usuario registrado con este email');
                    return done(null, user)
                }
                
                const newUser = {
                    firstName: profile._json.given_name,
                    lastName: profile._json.family_name,
                    email: profile._json.email,
                    password: ''
                }

                //const result = await userModel.create(newUser)
                const result = await usersService.createUser(newUser)

                return done(null, result)
            } catch (error) {
                return done('Error en login ' + error)
            }
        }
    ))

    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { firstName, lastName, age, email } = req.body
            try {
                //const user = await userModel.findOne({email: username}).lean().exec()
                const user = await usersService.getUserByEmail(username)

                if (user) {
                    console.log('Ya existe un usuario registrado con este email');
                    return done(null, false)
                }
                
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    age,
                    password: createHash(password)
                }

                //const result = await userModel.create(newUser)
                const result = await usersService.createUser(newUser)

                return done(null, result)

            } catch (error) {
                return done('Error en el registro ' + error)
            }
        }
    ))

    passport.use('login', new localStrategy(
        { usernameField: 'email' },
        async(username, password, done) => {
            try {
                //const user = await userModel.findOne({email: username}).lean().exec()
                const user = await usersService.getUserByEmail(username)

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
        //const user = await userModel.findById(id)
        const user = await usersService.getUserByID(id)
        done(null, user)
    })
}

export default initializePassport