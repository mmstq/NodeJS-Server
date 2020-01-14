const mongoose = require('mongoose');
const dateFormat  = require('dateformat');

const NoteSchema = mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Note"
    },
    content: String,
    time: {
        type: String,
        default: dateFormat(new Date(), "ddd, dS mmm, yyyy, h:MM TT")
    }
});

module.exports = mongoose.model('Note', NoteSchema);