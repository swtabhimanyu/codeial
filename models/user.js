const mongoose = require('mongoose');

const multer = require('multer');

const path = require('path');

const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {  //cb is callback function  cb(err,filename/dest_name)
        cb(null, path.join(__dirname, '..', AVATAR_PATH));  //__dirname is current director name
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());  //filename will be avtaar-Date.now()   //Date.now() gives Date in MiliSecondFormat or EPOK time
    }
})



//static
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');  //only single instance of file is to be stored using .single('avatar')
userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;