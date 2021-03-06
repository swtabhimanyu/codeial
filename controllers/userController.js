const User = require('../models/user');
const passport = require('passport');
const fs=require('fs');
const path=require('path');


//no need to convert into async await bcz there is only one callback
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }
    console.log('Inside signup function');
    res.render('userSignUp', {
        title: "Codial | SignUp"
    });
}



module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect(`/user/profile/${req.user.id}`);
    }
    console.log('Inside signIn function');
    res.render('userSignIn', {
        title: "codial | Sign In"
    });
};


module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, data) {
        return res.render('profile', {
            title: 'codial | profile',
            profile_user: data
        });
    });


};

//get user data  SIGNUP
module.exports.create = function (req, res) {
    //check if password and confirm password are same..if not same redirect to same page
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('err in finding user'); return; }

        //if user does not exsits
        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log('érr in creating user'); return; }
                console.log('user created');
                req.flash('success', 'Successfully Created User');
                return res.redirect('/user/signIn');

            });
        }
        //if user is already present redirect to signUp page
        else {
            console.log('user already exsits');
            req.flash('error', 'Account with same username already exsits');
            return res.redirect('back');
        }
    });
};


//SIGN IN AND CREATE A SESSION FOR USER
//passport.js come here 
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged In successfully');
    return res.redirect(`/user/profile/${req.user.id}`);
};


module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'Successfully signed out');
    res.redirect('/');
};



module.exports.update = async function (req, res) {


    if (req.user.id == req.params.id) {

        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log(err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {

                    let userAvatarPath=path.join(__dirname,'..',user.avatar);
                    
                    if (user.avatar && fs.existsSync(userAvatarPath)){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                        user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
                console.log(req.file);

            });
            // req.flash('success', 'Succesfully updated details');
            // return res.redirect('back');


        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }


    }
    else {
        req.flash('error', 'Unatuthorized');
        return res.status(401).send('Unauthorized');
    }
}