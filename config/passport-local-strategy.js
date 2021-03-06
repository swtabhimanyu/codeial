const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');


//authentication using passport for user signIn

// Ejs form userSignIn comes here after user.js in routes
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback:true  //added because we want to send request.flash() ...using this we will be able to set first argument of function as request
},function(req,email,password,done){   //this function return value to serializer function()   
    //here we are able to use first argument as req because of passReqtocallBack:true
    //find user and authenticate indentity
    //done(err,authentication) -- err=if err in finding user , authentication = data -if user is authenticated, false-if user is not authenticated
    User.findOne({email:email},function(err,user){
        if(err){
            req.flash('error',err);
            console.log(`${err} in finding user`);
            return done(err);
        }
        if(!user || user.password!=password){
            req.flash('error','Invalid username/password')
            console.log('Invalid username password');
            return done(null,false);
        }

        return done(null,user)
    });  
}
));



//serializing the user to decide which key is to kept in cookie
passport.serializeUser(function(user,done){
    done(null,user.id);  //encrypts user id and stores in cookie
});


//deserialzing user form the key in cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('err in finding user during deserialization');
            return done(err);
        }
        return done(null,user);
    })
}
);

//check if user is authenticated
//this fn will be used as middleware
passport.checkAuthentication=function(req,res,next){  //here next represent next function
    if(req.isAuthenticated()){
        //if user is authenticated pass req to controller
        return next();
    }
    else{
        res.redirect('/user/signIn');
    }
}


//once user is signed In passe user to views
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current loged in user from session cookie and we transfer the information from req.user to res.locals.user so that
        // it can be used in views
        res.locals.user=req.user;  
    }
        next();

}

module.exports=passport;