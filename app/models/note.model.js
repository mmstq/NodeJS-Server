const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Note"
    },
    content: String,
    time: {
        type: String,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema);