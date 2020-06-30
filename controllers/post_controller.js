const Post = require('../models/posts');
const Comment = require('../models/comments');


module.exports.post = async function (req, res) {
   try{
    let post= await Post.create({
        content: req.body.content,
        user: req.user.id
    });
    req.flash('success','Post published');
    return res.redirect('back');
   }catch(err){
       console.log(err);
       req.flash('error',err);
       return res.redirect('back');
   }
   
};


module.exports.delete = async function (req, res) {
    try{
    
    let post=await Post.findById(req.params.id);  
    
    //checking if user logged in is the only that is deleting his post...logged in user==author of post to be deleted
        if (post.user == req.user.id) {
            post.remove();

            await Comment.deleteMany({ post: req.params.id });
            req.flash('success','Post Deleted');
            
            return res.redirect('back');
          
        }
        else {
            console.log('ERR!!!user deleting post doest not match with the user who posted the post');
            req.flash('error','You cannot delete this post');
            return res.redirect('back');
        }
    

}catch(err){
    console.log(err);
    req.flash('error',err);
    return res.redirect('back');

}

};
