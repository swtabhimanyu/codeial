const Post = require('../models/posts');
const { populate } = require('../models/posts');

const User=require('../models/user');

module.exports.home = function (req, res) {
    // console.log(req.cookies); // accessing all cookies
    // res.cookie('user_id',22); // modifing cookie with key='user_id' with value=''22'

    Post.find({}).populate('user')
    .populate(
        {
            path:'comments',
            populate:{
                path:'user'
            }
        }
    )
    .exec(
        function (err, data) {
            if (err) {
                console.log('err in fetching posts');
                return;
            }
            console.log('posts fetched sucesfully');
            console.log(data);
            
            User.find({},{name:1},function(err,users){
                res.render('home', {
                    title: "codial | home",
                    posts: data,
                    all_users:users
                });  
            });
            
        })
}