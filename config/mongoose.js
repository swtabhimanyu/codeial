const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/development_authentication');

const db=mongoose.connection;


db.on('error',console.error.bind('conection error in DB'));
db.once('open',function(){
    console.log('successfully connected to DB');
});

module.exports=db;