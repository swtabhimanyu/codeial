const Post = require('../models/posts');
const Comment = require('../models/comments');
module.exports.post = function (req, res) {
    Post.create({
        content: req.body.content,
        user: req.user.id
    }, function (err, post) {
        if (err) {
            console.log('err in creating post');
            return;
        }
        console.log('successfully posted');

    });
    res.redirect('back');
};


module.exports.delete = function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) { console.log('err if finding post during delete'); return; }
        //checking if user logged in is the only that is deleting his post...logged in user==author of post to be deleted
        if (post.user == req.user.id) {
            post.remove();

            Comment.deleteMany({ post: req.params.id }, function (err) {
                if (err) {
                    console.log('err in deleting comments');
                    return;
                }
                
            res.redirect('back');
            });
        }
        else {
            console.log('ERR!!!user deleting post doest not match with the user who posted the post');
            res.redirect('back');
        }
    })
};


