const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/users.model');

router.post('/signup', (req, res, next) => {

    User.find({
        email: req.body.email
    }).
        exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'User exists'
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
                            name: req.body.name
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User Created Successfully'
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
                    message: 'Invalid email address'
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
                    '@qwerty312',{
                        expiresIn:'1h'
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

