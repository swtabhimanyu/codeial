const express=require('express');
const router=express.Router();
const passport=require('passport');

const userController=require('../controllers/userController');
const { route } = require('.');


router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.get('/signUp',userController.signUp);  //render signUp page
router.get('/signIn',userController.signIn);  //render signIn page


router.post('/create',userController.create);    //EJS form for userSignUp posts req here for signUp of User


//Ejs comes here and transfer control to passport-local for authentication
router.post('/create-session' , passport.authenticate(      // EJS form for userSignIn posts req here for signIn of user
    'local',  //strategy used in passport
    {failureRedirect:'/user/signIn'}   //if user fails to signIn,i.e,passport returns err then signIn page is reloaded
) ,userController.createSession  //if user sucessfully signIn then it transfer control to controller for create session
);


router.get('/signOut',userController.destroySession);

module.exports=router;