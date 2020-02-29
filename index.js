require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const user = require('./app/routes/user.routes');
const checkAuth = require('./middleware/check-auth');
const model = require('./app/models/users.model')
const lodash = require('lodash')


// create express app
const app = express();
const http = require('http').createServer(app);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// Configuring the database
const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// parse requests of content-type - application/json
app.use(bodyParser.json())

const notes = require('./app/controller/note.controller');

app.use('/user', user);

app.post('/notes', checkAuth, notes.create);

app.get('/notes', checkAuth, notes.findAll);

app.get('/notes/:noteId', checkAuth, notes.findOne);

// Update a Note with noteId
app.put('/notes/:noteId', checkAuth, notes.update);

// Delete a Note with noteId
app.delete('/notes/:noteId', checkAuth, notes.delete);

app.get('/', (req, res) => res.sendFile('./views/pages/pageFirst.html', { root: '.' }));

// Socket for Fast Chatting
const socketIO = require('socket.io')(http);

socketIO.on('connection', (socket) => {
    console.log('connected');
    socket.on('user_query', (args) => {
        var field = args.field;
        var value = args.value;
        console.log(`${field} : ${value}`)
        model.find({ field: value }).exec()
            .then(note => {
                if (note) {
                    console.log(note);
                    socket.emit('search_result', note);
                }else{strings in javascript
                    console.log('No result, Sorry')
                socket.emit('search_result', 'No result found')
                }
            }).catch(err=>{
                console.log(err);
            });
    })
    socket.on('userNameCheck', (username) => {
        console.log(username);
        model.findOne({ username: username }, 'username').exec()
            .then(username => {
                if (username) {
                    console.log(username);
                    socket.emit('result', true);
                } else {
                    console.log('not found username');
                    socket.emit('result', false)
                }

            }).catch(err => {
                console.log(err);
                socket.emit('result', false);
            });
    });
});
// listen for requests
http.listen(PORT, () => {
    console.log("Server is listening on port: " + PORT);
});
