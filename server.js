'use strict';

var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    hbs = require('express-handlebars'),
    path = require('path');

var ssn = ''; 

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir: __dirname + '/app/views/layouts/'}));
    
app.set('views',path.join(__dirname, 'app/views'));
    
app.set('view engine', 'hbs');
    
app.use('/public', express.static(process.cwd() + '/public'));
    
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'secretClementine',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport, ssn);

app.listen(process.env.PORT,function(){
    console.log('Listening on port ' + process.env.PORT);
});