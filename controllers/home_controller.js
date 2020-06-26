module.exports.home=function(req,res){
    // console.log(req.cookies); // accessing all cookies
    // res.cookie('user_id',22); // modifing cookie with key='user_id' with value=''22'
    res.render('home',{
        title : "codial | home"
    });
}