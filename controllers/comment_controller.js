const Comment = require('../models/comments');
const Post = require('../models/posts');

const commentMailer=require('../mailers/comments_mailer');

module.exports.create = async function (req, res) {
try{
    let post = await Post.findById(req.body.postId);
    if (post) {
        let comment = await Comment.create({
            content: req.body.content,
            user: req.user.id,
            post: req.body.postId
        });

        comment=await comment.populate('user','name email').execPopulate();
        
        post.comments.push(comment);   //update posts db by adding comments related to that post
        post.save();            //called everytime when we update db

        commentMailer.newComment(comment);


        if(req.xhr){
            // console.log('Inside create comment controller');
            return res.status(200).json({
                data:{
                    comment:comment
                },
                message:"Comment PUblished"
            });
        }

        req.flash('success','Comment published');
        res.redirect('/')
    }

}catch(err){
    console.log(err);
    req.flash('error',err);
    return res.redirect('back');
}
 
        
    
};


module.exports.destroy = async function (req, res) {
    try{
        let comment=await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            let postId = comment.post;

            comment.remove();

            let post=await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            
            if(req.xhr){
                // console.log('inside comments xhr');
                return res.status(200).json({
                    data:{
                        comment_id:req.params.id
                    }
                    ,message:"Comment Deleted Successfully"
                })
            }
            
            req.flash('success','Comment deleted');
            return res.redirect('back');
            
        }
        else {
            console.log('ERR!!LOGGED IN USER IS NOT SAME AS AUTHOR OF COMMENT');
            req.flash('erroe','Ypu dont have permision to delete comment');
            return res.redirect('back');
        }


    }catch(err){
        console.log(err);
        req.flash('error',err);
        return res.redirect('back');
    }
    
};