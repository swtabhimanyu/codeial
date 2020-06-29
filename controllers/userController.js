const User = require('../models/user');
const passport = require('passport');

module.exports.signUp = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    console.log('Inside signup function');
    res.render('userSignUp', {
        title: "Codial | SignUp"
    });
}



module.exports.signIn = function (req, res) {

    if(req.isAuthenticated()){
        return res.redirect(`/user/profile/${req.user.id}`);
    }
    console.log('Inside signIn function');
    res.render('userSignIn', {
        title: "codial | Sign In"
    });
};


module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,data){
        return res.render('profile',{
            title:'codial | profile',
            profile_user:data
        });
    });

    
};

//get user data  SIGNUP
module.exports.create = function (req, res) {
    //check if password and confirm password are same..if not same redirect to same page
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function (err, user) {
        if (err) { console.log('err in finding user'); return; }

        //if user does not exsits
        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log('érr in creating user'); return; }
                console.log('user created');
                return res.redirect('/user/signIn');

            });
        }
        //if user is already present redirect to signUp page
        else{
            console.log('user already exsits');
            return res.redirect('back');
        }
    });
};


//SIGN IN AND CREATE A SESSION FOR USER
//passport.js come here 
module.exports.createSession = function (req, res) {
     return res.redirect('/user/profile');
};


module.exports.destroySession=function(req,res){
    req.logout();
    res.redirect('/');
};



module.exports.update=function (req,res) {
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,{name:req.body.name,email:req.body.email},function(err,user) {
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorized');
    }
}