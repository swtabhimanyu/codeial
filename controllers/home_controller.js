const Post = require('../models/posts');
const { populate } = require('../models/posts');

const User = require('../models/user');

module.exports.home = async function (req, res) {
    // console.log(req.cookies); // accessing all cookies
    // res.cookie('user_id',22); // modifing cookie with key='user_id' with value=''22'


    //posts will contain all the posts

    try{
    let posts = await Post.find({})
    .sort('-createdAt')
        .populate('user')
        .populate(
            {
                path: 'comments',
                options: { sort: { createdAt: -1 }},
                populate: {
                    path: 'user'
                }
            }
        )

    let users =await User.find({});
    return res.render('home', {
        title: "codial | home",
        posts: posts,
        all_users: users
    });


    }catch(err){
        console.log(err);
        return;
    }


}