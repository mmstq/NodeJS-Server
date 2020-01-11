module.export = (app) => {

    const notes = require('./note.controller');


    // create a new note

    app.post('/notes', notes.create);

    app.get('/notes', notes.findAll);

    app.get('/notes/:noteId', notes.findOne);

    // Update a Note with noteId
    app.put('/notes/:noteId', notes.update);

    // Delete a Note with noteId
    app.delete('/notes/:noteId', notes.delete);

}