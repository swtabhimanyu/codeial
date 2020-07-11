const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path')

//transporter is an object which will be attached to nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user: 'codepeople3108',   //gmail id
        pass: 'abhi2009'         //gmail id password    
    }
});

//defining that we will be using ejs

let renderTemplate = (data, relativePath) => {
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),  //here we store templates in views/mailers folder
        data,
        function (err, template) {
            if (err) {
                console.log('err in rendering mailer',err);
                return;
            }
            mailHtml = template;
        }
    )
    return mailHtml;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
};