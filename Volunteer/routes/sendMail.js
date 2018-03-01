var nodeMail =require('nodemailer');

var transporter = nodeMail.createTransport({
    host:'smtp.qq.com',
    secureConnection:true,
    port:465,
    auth:{
        user:'530829880@qq.com',
        pass:'gtvfcialhlpubgcd',
    }
});

/*transporter.sendMail({
    from:'Admin 530829880@qq.com',
    to:'fdgd7602@gmail.com',//需要读数据库所有volunteer的邮箱
    subject: 'Node js send from qq email through',
    /!*text:'Mail from node!!! '*!/
    html:'<b>test email </b>'//需要发送service Requst里的数据带sign up的人的名字
}), function (err, res) {
    "use strict";
    console.log(res);
};*/
function sendConfirmedEmail(users, text) {
    console.log("user email", users);
    var mailOptions = {
        from: 'Admin 530829880@qq.com',
        to: '' + users,
        subject: 'About the activity information',
        text: ''+text,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err){
            return console.log(err);
        } else {
            console.log('Message sent: ', info.response);
        }
    })
}
module.exports.sendConfirmedEmail = sendConfirmedEmail;


/*function findAllMembersEmail(title, cb) {
    ServiceRequest.findByTitle(title, function (err, service) {
        var emails = [];
        service.signInMember.forEach(function (member) {
            //find member by id
            emails.push(member.volunteeremail);
        })
    });
}*/



