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


module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(err){
            console.log('err in finding comment during delete');
            return;
        }
        if(comment.user==req.user.id){
            let postId=comment.post;

            comment.remove();

            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
                return res.redirect('back');
            });
        }
        else{
            console.log('ERR!!LOGGED IN USER IS NOT SAME AS AUTHOR OF COMMENT');
            return res.redirect('back');
        }
    });

};