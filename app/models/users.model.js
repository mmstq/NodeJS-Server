const mongoose = require('mongoose');
const dateformat = require('dateformat');
const Joi = require('@hapi/joi')



const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: Joi.string()
        .email()
        .required()
        .min(8),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    username: Joi.string().min(3).max(10).required(),
    name: Joi.ref('username'),
    favorite: { type: Array, default: [] },
    cards: { type: Array, default: [] },
    joined: { type: String, default: dateformat(new Date()) }
});

module.exports = mongoose.model('User', UserSchema);
