require('dotenv').config()
const PORT = process.env.PORT || 5000
const express = require('express')
const httpRequest = require('https')
const bodyParser = require('body-parser')
const user = require('./app/routes/user.routes')
const checkAuth = require('./middleware/check-auth')
const model = require('./app/models/users.model')
const script = require('./app/scripts/script.handler')
const notes = require('./app/controller/note.controller')
const app = express();
const dbConfig = require('./config/database.config')
const mongoose = require('mongoose')
const http = require('http').createServer(app);
const socketIO = require('socket.io')(http)


app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())


mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

setInterval(function () {
    console.log('i am runnig u happy now :(')
    script.getNotice()
}, 300000)

app.use('/user', user);
app.post('/notes', checkAuth, notes.create);
app.get('/notes', checkAuth, notes.findAll);
app.get('/notice', script.getNotice);
app.get('/notes/:noteId', checkAuth, notes.findOne);
app.put('/notes/:noteId', checkAuth, notes.update);
app.delete('/notes/:noteId', checkAuth, notes.delete);
app.get('/', (req, res) => {
    res.sendFile('./views/pages/pageFirst.html', { root: '.' })
    const options = {
        method: 'GET',
        host: 'https://mmstq.herokuapp.com',
        path: '/'
    }
    const r = httpRequest.request(options, res => {

    })
});


socketIO.on('connection', (socket) => {
    console.log('connected');
    socket.on('user_query', (args) => {
        const arg = JSON.parse(args)
        // var regex = RegExp("/.*" + arg.va + ".*/")
        console.log(`${arg.field} : ${arg.value}`)
        const query = {}
        query[arg.field] = new RegExp('^' + arg.value)
        model.find(query, { _id: 0, name: 1, email: 1 }).exec()
            .then(note => {
                if (note) {
                    console.log(note);
                    socket.emit('search_result', note);
                } else {
                    console.log('No result, Sorry')
                    socket.emit('search_result', 'No result found')
                }
            }).catch(err => {
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
})

http.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
})
