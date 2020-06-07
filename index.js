const express=require('express');
const port=8000;

const app=express();
const layouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

const cookieParser=require('cookie-parser');


app.use(express.urlencoded());

app.use(layouts);
app.use(cookieParser());
app.set('view engine','ejs');
app.set('views','./views');
app.use('/',require('./routes'));





app.listen(port,function(err){
    if(err){
        console.log(`${err} found while loading server`);
        return;
    }
    console.log(`Server up and running on port ${port}`);
});