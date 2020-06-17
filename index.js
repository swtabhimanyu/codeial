const express=require('express');
const port=8000;

const cookieParser=require('cookie-parser');

const app=express();
const layouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const MongoStore=require('connect-mongo')(session);

app.use(express.urlencoded());

app.use(layouts);
app.use(cookieParser());
app.set('view engine','ejs');
app.set('views','./views');



//mongo store is used to store session cookie in DB
app.use(session({
    name:'codial',
    //TODO change the secret before deployment in production mode
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000 * 60 * 100)   //in miliseconds
    },
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:false
    },function(err){
        console.log(err || 'connection to mongoStore succesful');
    }) 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);   //whenever passport is being intialized the authenticated user is being set in views local


app.use('/',require('./routes'));





app.listen(port,function(err){
    if(err){
        console.log(`${err} found while loading server`);
        return;
    }
    console.log(`Server up and running on port ${port}`);
});