var nodemailer = require('nodemailer');
var smtpPool=require('nodemailer-smtp-pool');
var mailConfig=require('./mailconfig');
const express = require('express');

const router = express.Router();

router.post("/nodemailerTest", function(req, res, next){

    //nodemailer 의 createTransport는 transporter 객체를 만드는 메소드인데

    //nodemailer-smtp-pool 객체 인스턴스가 이 메소드의 인자로 쓴다.

    var smtpTransport=nodemailer.createTransport(smtpPool( {
        service: mailConfig.mailservice,
        host:'localhost',
        port:'465',
        tls:{
            rejectUnauthorize:false
        },

        //이메일 전송을 위해 필요한 인증정보

        //gmail 계정과 암호
        auth:{
            user: mailConfig.mailid,
            pass: mailConfig.mailpassword
        },
        maxConnections:5,
        maxMessages:10
    }) );

    var mailOpt={
        from:'gusraccoon@gmail.com',
        to:'gus.kim@kt.com',
        subject:'Nodemailer 테스트2222',
        html:'<h1>메일 라우팅 테스트</h1>'
    }

    smtpTransport.sendMail(mailOpt, function(err, res) {
        if( err ) {
            console.log(err);
        }else{
            console.log('Message send :'+ res);
        }

        smtpTransport.close();
    })

    res.redirect("/");

})

module.exports = router;
