const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;



const User = require('../models/users.model');

function sendEmail(email, OTP) {
    const clientID = '842451485450-mlasbtjd54natvtgjmmpv7nmqh8dmeso.apps.googleusercontent.com';
    const clientSecret = "4NpNOUjyIxi_KaXmzsHEXLCJ";
    const refresh_token = "1//04W0ZRpDRDPvPCgYIARAAGAQSNwF-L9IrU01OEhB4vg6QtBFm2BYd6jWuJm2i2atYlbTxlrQETbF4g-SQSw16R6Xjcm9taA5UJmM"

    const oauth2Client = new OAuth2(
        `Your ClientID ${clientID}`,
        `${clientSecret}`, // Client Secret
        `https://developers.google.com/oauthplayground` // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: refresh_token
    });
    const accessToken = oauth2Client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
             type: "OAuth2",
             user: "your.gmail.here@gmail.com", 
             clientId: clientID,
             clientSecret: clientSecret,
             refreshToken: refresh_token,
             accessToken: accessToken
        }});

        const mailOptions = {
            from: "mushtakkhan9@gmail.com",
            to: email,
            subject: "Node.js Email with Secure OAuth",
            generateTextFromHTML: true,
            html: "<b>test</b>",
            text: OTP
       };

       smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
   });

    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'testdeveloper151@gmail.com',
    //         pass: '@lesswire9'
    //     }
    // });
    // var mailOptions = {
    //     from: 'testdeveloper151@gmail.com',
    //     to: email,
    //     subject: 'Note App Password Forgot',
    //     text: `Your Note App OTP to reset password is: ${OTP}`
    //     // html: '<h1>Hi People</h1><p>Your Message</p>'
    // };
    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
}

function generateOTP() {
    return Math.floor(Math.random() * (99999 - 10000) + 10000);
}

router.post('/forgotPassword', (req, res, next) => {
    console.log('forgot');
    User.find({
        email: req.body.email
    }).exec()
        .then(user => {
            console.log(user);
            if (user.length > 0) {
                var otp = generateOTP();
                sendEmail(req.body.email, otp);
                res.status(HttpStatus.OK).json({
                    username: user[0].username,
                    id: user[0]._id,
                    name: user[0].name,
                    email: user[0].email,
                    OTP: otp
                });
            } else {

                res.status(HttpStatus.NOT_FOUND).json({
                    message: "User Not Found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
});

router.post('/signup', (req, res, next) => {

    User.findOne({
        email: req.body.email
    }).
        exec()
        .then(user => {
            if (user) {
                return res.status(409).json({
                    message: 'There is already an account associated with this email'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            username: req.body.username,
                            name: req.body.name,
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User registration successful'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(501).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            });

        });

});

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: 'No user associated with this email'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, resource) => {
                if (err) {
                    return res.status(404).json({
                        message: 'Auth failed'
                    });
                }
                if (resource) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.ObjectId,
                        username: user.username
                    },
                        '@qwerty312', {
                        expiresIn: '1h'
                    });
                    return res.status(200).json({
                        message: 'Auth Success',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            });

        })
        .catch(err => {
            res.status(404).json({
                message: err
            });
        });
});

router.delete('/:userId', (req, res, next) => {
    User.deleteOne({ _id: req.params.userId }).exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;

