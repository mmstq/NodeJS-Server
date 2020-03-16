const mongoose = require('mongoose');
const dateFormat  = require('dateformat');
const moment = require('moment')

const NoteSchema = mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Note"
    },
    content: String,
    time: {
        type: String,
        default: moment(new Date(), "YYYY-MM-DD HH:mm").fromNow()
    }
});

module.exports = mongoose.model('Note', NoteSchema);