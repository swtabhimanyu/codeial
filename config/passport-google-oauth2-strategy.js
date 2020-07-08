const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to use new strategy for user login if exsits otherwise cretae user
passport.use(new googleStrategy({
    clientID: '374614658047-0lu7t0nif0sej6or3d7j869c90dg3p50.apps.googleusercontent.com',
    clientSecret: 'ztFcXFNNtu7arwwCpKrogNlG',
    callbackURL: 'http://localhost:8000/user/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
    //find user
    User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
        if (err) {
            console.log('err in google strategy passport');
            return;
        }
        console.log(profile);
        if (user) {
            //if found, set user as req.user --> sign in user
            return done(null, user);   //signin user
        }
        else{
            // if not found creater user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                //assigning random password to user, crypto.randomBytes(<byte of password to be generated>).toString('hex') --> hex stands for hexadecimal
                password:crypto.randomBytes(20).toString('hex')  
                
            },function(err,user){
                if(err){
                    console.log('err in creating user',err);
                    return;
                }
                return done(null,user);
            })
        }

    });
}))