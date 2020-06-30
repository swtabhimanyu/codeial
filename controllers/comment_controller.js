const Comment = require('../models/comments');
const Post = require('../models/posts');

module.exports.create = async function (req, res) {
try{
    let post = await Post.findById(req.body.postId);
    if (post) {
        let comment = await Comment.create({
            content: req.body.content,
            user: req.user.id,
            post: req.body.postId
        });

        post.comments.push(comment);   //update posts db by adding comments related to that post
        post.save();            //called everytime when we update db
        res.redirect('/')
    }

}catch(err){
    console.log(err);
    return;
}
 
        
    
};


module.exports.destroy = async function (req, res) {
    try{
        let comment=await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            let postId = comment.post;

            comment.remove();

            let post=await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            return res.redirect('back');
            
        }
        else {
            console.log('ERR!!LOGGED IN USER IS NOT SAME AS AUTHOR OF COMMENT');
            return res.redirect('back');
        }


    }catch(err){
        console.log(err);
        return;
    }
    
};