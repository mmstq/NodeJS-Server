const mongoose = require('mongoose');
const dateformat = require('dateformat');


const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    joined: {type: String, default: dateformat(new Date())}
});

module.exports = mongoose.model('User', UserSchema);
