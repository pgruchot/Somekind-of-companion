const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const session = require('express-session');
const server = express();
const morgan = require('morgan');
const passport = require('./config/passport')
const https = require('https');
const fs = require('fs');

//https local server setup
server.get('/', (req, res) => {
    res.send("Local https working")
})

//local certificates
const httpsOptions = {
    key: fs.readFileSync('./security/server.key'),
    cert: fs.readFileSync('./security/cert.pem')
}
const serverHttps = https.createServer(httpsOptions, server)
    .listen(5000, () => {
        console.log('server running at ' + 5000)
    })


//Middleware for parsing request bodies
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

//Request info for developers
server.use(morgan('dev'));

//Session setup
server.use(session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1*60*60*1000 },
}));

//Passport middleware init
server.use(passport.initialize());
server.use(passport.session());

//Routers
server.use('/auth', require('./auth'));
server.use('/profile', require('./profile'));

//Cloud database
// mongoose.connect(keys.mongoDB.dbURI, { useNewUrlParser: true }).then(
//     () => {
//         console.log('Connected to database :)');
//     }
// ).catch(err => {
//     console.log('Cant connect to database :(');
//     console.log(err);
// });

//local database
mongoose.connect('mongodb://localhost:27017/destiny', { useNewUrlParser: true }).then(
    () => {
        console.log('Connected to database :)');
    }
).catch(err => {
    console.log('Cant connect to database :(');
    console.log(err);
});

