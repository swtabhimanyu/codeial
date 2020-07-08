const express = require('express');
const port = 8000;

const cookieParser = require('cookie-parser');

const app = express();
const layouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');


const flash = require('connect-flash');
const customMidleware=require('./config/middleware');
const { constants } = require('crypto');


app.use(sassMiddleware(
    {
        src: './assets/scss',   //where are scss files are places
        dest: './assets/css',   //place where the scss file are compiled and placed after compilation
        debug: true,             //debug=false -->no error shown if scss files fails to load , debug=false --> error shown if scss file fails to load
        outputStyle: 'extended',
        prefix: '/css'
    }));

app.use(express.static('./assets'));
app.use(express.urlencoded());

app.use(cookieParser());

//make uploads path available to browser
app.use('/uploads',express.static(__dirname+'/uploads'));   //uploads folder can be accesed at router 'localhost:8080/uploads/'

app.use(layouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);





app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store session cookie in DB
app.use(session({
    name: 'codial',  //name of cookie
    secret: 'blahsomething',   //TODO change the secret before deployment in production mode
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)   //in miliseconds
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: false
    }, function (err) {
        console.log(err || 'connection to mongoStore succesful');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);   //whenever passport is being intialized the authenticated user is being set in views local



//always use flash after session because flash uses session cookies 
app.use(flash());

app.use(customMidleware.setFlash);

app.use('/', require('./routes'));


app.listen(port, function (err) {
    if (err) {
        console.log(`${err} found while loading server`);
        return;
    }
    console.log(`Server up and running on port ${port}`);
});

