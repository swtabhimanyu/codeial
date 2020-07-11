const nodeMailer = require('../config/nodemailer');


exports.newComment = (comment) => {
    console.log('Inside new comment mailer');
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comments.ejs')
    nodeMailer.transporter.sendMail({
        from:'codepeople3108@gmail.com',
        to : comment.user.email,
        subject : 'New comment',
        html : htmlString
    },(err,info) => {
        if(err){
            console.log('err in sending mail',err);
            return;
        }
        console.log('Mail sentt',info);
        return;
    });
}