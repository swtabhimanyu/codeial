const Post = require('../models/posts');
const { populate } = require('../models/posts');

module.exports.home = function (req, res) {
    // console.log(req.cookies); // accessing all cookies
    // res.cookie('user_id',22); // modifing cookie with key='user_id' with value=''22'

    Post.find({}).populate('user').exec(
        function (err, data) {
            if (err) {
                console.log('err in fetching posts');
                return;
            }
            console.log('posts fetched sucesfully');
            console.log(data);
            res.render('home', {
                title: "codial | home",
                posts: data
            });
        })
}