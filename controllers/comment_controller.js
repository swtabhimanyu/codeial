const Comment=require('../models/comments');
const Post=require('../models/posts');

module.exports.create=function(req,res){

    Post.findById(req.body.postId,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                user:req.user.id,
                post:req.body.postId
            },function(err,comment){
                if(err){
                    console.log('err in posting comment');
                    return;
                }
                else{
                    post.comments.push(comment);   //update posts db by adding comments related to that post
                    post.save();            //called everytime when we update db
                    res.redirect('/')
                }
            })
        }
    })
};