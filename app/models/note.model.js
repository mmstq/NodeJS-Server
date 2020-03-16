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
        default: moment().format("ddd, dS mmm, yyyy, h:MM TT")
    }
});

module.exports = mongoose.model('Note', NoteSchema);