const mongoose = require('mongoose');

const NoticeSchema = mongoose.Schema({
    index:{type: Number},
    title: {type: String},
    date: String,
    link: {type:String, default:''}
});
module.exports = mongoose.model('Notice', NoticeSchema);