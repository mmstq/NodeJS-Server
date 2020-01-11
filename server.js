const PORT = process.env.PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// Configuring the database
const dbConfig = require('../nodeserver/config/database.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// parse requests of content-type - application/json
app.use(bodyParser.json())

const notes = require('../nodeserver/app/controller/note.controller');


// create a new note

app.post('/notes', notes.create);

app.get('/notes', notes.findAll);

app.get('/notes/:noteId', notes.findOne);

// Update a Note with noteId
app.put('/notes/:noteId', notes.update);

// Delete a Note with noteId
app.delete('/notes/:noteId', notes.delete);

// define a simple route
app.get('/', (req, res) => {
    res.json({
        "message": "Welcome to EasyNotes application."
    });
});


// listen for requests
app.listen(PORT, () => {

    console.log("Server is listening on port 3000");
});