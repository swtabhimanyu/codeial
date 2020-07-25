const Post = require('../models/posts');
const Comment = require('../models/comments');
const Like = require('../models/like');


module.exports.post = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if (req.xhr) {

            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: 'Post created'
            });
        }

        req.flash('success', 'Post published');
        return res.redirect('back');
    } catch (err) {
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }

};


module.exports.delete = async function (req, res) {
    try {

        let post = await Post.findById(req.params.id);

        //checking if user logged in is the only that is deleting his post...logged in user==author of post to be deleted
        if (post.user == req.user.id) {


            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            console.log(post.comments);
            await Like.deleteMany({likeable: {$in: post.comments}}); 
            post.remove();
            
            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "post deleted"
                });
            }
            req.flash('success', 'Post Deleted');

            return res.redirect('back');

        }
        else {
            console.log('ERR!!!user deleting post doest not match with the user who posted the post');
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }


    } catch (err) {
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');

    }

};
