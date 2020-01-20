const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const nodemailer = require('nodemailer');



const User = require('../models/users.model');

function sendEmail(email, OTP) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'testdeveloper151@gmail.com',
            pass: '@lesswire9'
        }
    });
    var mailOptions = {
        from: 'testdeveloper151@gmail.com',
        to: email,
        subject: 'Note App Password Forgot',
        text: `Your Note App OTP to reset password is: ${OTP}`
        // html: '<h1>Hi People</h1><p>Your Message</p>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
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

