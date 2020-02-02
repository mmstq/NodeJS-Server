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

    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });
    const accessToken = oauth2Client.getAccessTokenAsync();

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.MY_EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken
        },
        tls: { rejectUnauthorized: false },

    });

    const mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Notes App Forgot Password",
        generateTextFromHTML: true,
        html: `Your Note App OTP For Resetting Password is: ${OTP}`,
    };
    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log("error sending mail")
            console.error(error.stack || error)
        }
    });
}

const generateOTP = () => Math.floor(Math.random() * (99999 - 10000) + 10000).toString();

router.post('/forgotPassword', (req, res, next) => {
    console.log('forgot');
    User.findOne({
        email: req.body.email
    }).exec()
        .then(user => {
            console.log(user);
            if (user) {
                const otp = generateOTP();
                sendEmail(user.email, otp);
                res.status(HttpStatus.OK).json({user:{
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    password:''
                },
            extra:{
                OTP: otp,
                id: user.id,
            }});
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

router.put('/updatePassword/:userId', (req, res, next) => {
    console.log(req.body, req.params);
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            User
                .findByIdAndUpdate(req.params.userId, {
                    password: hash,
                    username: req.body.username,
                    name: req.body.name,
                    email: req.body.email
                },
                {
                    new: true
                }).exec()
                .then(result => {
                    res.status(HttpStatus.CREATED).json({
                        message: 'Password reset successful'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(501).json({
                        error: err
                    });
                });
        }
    })

})

router.post('/signup', (req, res, next) => {

    User.findOne({
        email: req.body.email
    }).
        exec()
        .then(user => {
            if (user) {
                return res.status(HttpStatus.CONFLICT).json({
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
                                res.status(HttpStatus.CREATED).json({
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
                return res.status(HttpStatus.NOT_FOUND).json({
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
                        process.env.BCRYPT_KEY, {
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

