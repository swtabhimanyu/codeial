const Post=require('../models/posts');

module.exports.post=function(req,res){
    Post.create({
        content:req.body.content,
        user:req.user.id
    },function(err,post){
        if(err){
            console.log('err in creating post');
            return;
        }

            console.log('successfully posted');
        
    });
    res.redirect('back');
}


