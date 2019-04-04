// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

//[smtp mail]
var nodemailer = require('nodemailer');
var severConfig=require('./severconfig');
var smtpPool=require('nodemailer-smtp-pool');

//var fcm = require('fcm-node');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;

// [ CONFIGURE mongoose ] start

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

// sample ex) mongoose.connect('mongodb://username:password@host:port/database?options...');
mongoose.connect('mongodb://localhost/mongodb_tutorial');
// [ CONFIGURE mongoose ] end

// CONNECT TO MONGODB SERVER after DEFINE MODEL
//var Book = require('./models/book');
var DriveInfo = require('./models/driveInfo');
var KarforuInfo = require('./models/karforuInfo');

var SmtpPool = smtpPool( {
    service: severConfig.mailservice,
    host:'localhost',
    port:'465',
    tls:{
        rejectUnauthorize:false
    },

    //이메일 전송을 위해 필요한 인증정보

    //gmail 계정과 암호
    auth:{
        user: severConfig.mailid,
        pass: severConfig.mailpassword
    },
    maxConnections:5,
    maxMessages:10
});

var pushServerKey = severConfig.severkey;
// [CONFIGURE ROUTER]
//라우터에서 Book 모델을 사용해야 하므로 Book sckema 를 전달한다.
var router = require('./routes')(app, DriveInfo, SmtpPool, pushServerKey, KarforuInfo);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port);
});
