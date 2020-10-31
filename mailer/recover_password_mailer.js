const node_mailer = require('../config/nodemailer');

exports.recoverylink = (recover_user) => {
    let htmlString = node_mailer.renderTemplate({recover_user: recover_user}, '/password_recover/recover_password.ejs');


    node_mailer.transporter.sendMail({
        from: 'codeial',
        to: recover_user.user.email,
        subject: 'Password Recovery Link',
        html: htmlString
    },(err, info) =>{
        if(err){console.log('error in recover_password_mailer.js', err); return;}
        console.log('message sent', info);
        return;
    }
    );
}