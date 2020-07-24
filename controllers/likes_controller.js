const Like=require('../models/like');
const Comment=require('../models/comments');
const Post=require('../models/posts');


module.exports.toggleLike=async function(req,res){

    try{

        //url format - /likes/toggle?id=id_of_post_comment&type=comment
        let likeable;
        let deleted=false;

        if(req.query.type=="Post"){
            likeable=await Post.findById(req.query.id).populate('likes');   
        }else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

        //check if like already exsists
        let exsitingLike= await Like.findOne({
            likeable:req.query.id,  //passing comment or post id to check if like on that post already exsits
            onModel:req.query.type,
            user:req.user._id
        });

        //if like already exsits then delete it
        if(exsitingLike){
            likeable.likes.pull(exsitingLike._id);   //removing like from likes array in post/comments
            likeable.save();
            console.log('Deleting like from Schemaa')
            exsitingLike.remove();  //removing like from like Schema

            deleted=true;
        }

        //creating new like if like doesn't exsits
        else{
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.status(200).json({
            message:'Request Successful',
            data:{
                deleted:deleted
            }
        })



    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
};

