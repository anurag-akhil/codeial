const node_mailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    let htmlString = node_mailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');


    node_mailer.transporter.sendMail({
        from: 'codeial',
        to: comment.user.email,
        subject: 'new comment published',
        html: htmlString
    },(err, info) =>{
        if(err){console.log('error in comments_mailer.js', err); return;}
        console.log('message sent', info);
        return;
    }
    );
}