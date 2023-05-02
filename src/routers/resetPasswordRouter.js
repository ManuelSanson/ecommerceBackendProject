import { Router } from "express";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import userModel from "../DAO/mongo/models/userModel.js";
import { logger } from "../config/logger.js";
import config from "../config/config.js";
import jwt from 'jsonwebtoken';

export const resetPasswordRouter = Router()

resetPasswordRouter.post('/', async (req, res) => {
    const email = req.body.email;

    const user = await userModel.findOne({email});
    if (!user) {
        return res.send('Usuario no encontrado')
    }

    const resetToken = jwt.sign({
        email
    }, config.jwtKey, { expiresIn: 60 * 60 })


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        type: 'PLAIN',
        auth: {
            user: config.mailUser,
            pass: config.mailPass
        },
        tls: {
        rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: config.mailUser,
        to: email,
        subject: 'Password Reset',
        html: `
        <p>You requested a password reset</p>
        <p>Click <a href="http://localhost:8080/resetPassword/${resetToken}">here</a> to reset your password</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error);
            return res.status(500).json({
                message: 'Failed to send email'
            });
        }
        logger.info('Email sent: ' + info.response);
        res.status(200).json({
            message: 'Email sent'
        });
    });
});

resetPasswordRouter.post('/:token', async (req, res) => {
    const token = req.params.token;
    const password = req.body.password;

    try {
        const decodedToken = jwt.verify(token, config.jwtKey);
        
        const user = await userModel.findOne({email: decodedToken.email})

        if (!user) {
            return res.send('Usuario no encontrado')
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
    
        user.password = hashedPassword;
        
        await user.save();
    
        res.send('Password actualizada')

    } catch(err) {
        logger.error(err);
        return res.send({success: false, error: 'There is an error'})
    }
});