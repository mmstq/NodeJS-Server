const Note = require('../models/note.model');

exports.create = async (req, res) => {

    if (!req.body.content) {
        return res.status(400).send({
            message: 'Note cannot be empty'
        });
    }

    const note = new Note({
        title: req.body.title,
        content: req.body.content
    });

    await note.save().then(data => {
        res.status(201).json({
            message: "Note added to database"
        });
    }).
    catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });

};

exports.findAll = async (req, res) => {

    await Note.find()
        .then(notes => {
            res.send(notes);
            console.log(notes)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });

};

exports.findAllWhere = async (req, res) => {

    await Note.find()
        .then(notes => {
            res.send(notes);
            console.log(notes)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });

};

// Find a single note with a noteId
exports.findOne = async (req, res) => {

    await Note.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Not found"
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: err.message || "Not found"
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.noteId
            });
        });


};

// Update a note identified by the noteId in the request
exports.update = async (req, res) => {

    // Find note and update it with the request body
    await Note.findByIdAndUpdate(req.params.noteId, {
            title: req.body.title || "Untitled Note",
            content: req.body.content
        }, {
            new: true
        })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Not found"
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: err.message || "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error updating note"
            });
        });

};

// Delete a note with the specified noteId in the request
exports.delete = async (req, res) => {

    await Note.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Not found"
                });
            }
            res.send({
                message: "Note deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: err.message || "Not found"
                });
            }
            return res.status(500).send({
                message: "Could not delete note. Please try again"
            });
        });
};
