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
// mongoose.connect('mongodb://localhost/mongodb_tutorial');
mongoose.connect('mongodb://localhost/karforu');
// [ CONFIGURE mongoose ] end

// CONNECT TO MONGODB SERVER after DEFINE MODEL
//var Book = require('./models/book');
var DriveInfo = require('./models/driveInfo');
var KarforuInfo = require('./models/karforuInfo');

// yhkim 추가 셔틀 시간표
var ShuttleTimes = require('./models/shuttleTimes');
// yhkim 추가 셔틀/사송 회원정보
var SsUser = require('./models/ssUser');

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

var pushServerKey = severConfig.pushSeverkey;
// [CONFIGURE ROUTER]
//라우터에서 사용되는 모델 또는 설정값, 메시징규격 등을 전달한다.
//var router = require('./routes')(app, DriveInfo, SmtpPool, pushServerKey, KarforuInfo);
//라우터를 유형별로 나눈다. index/push/mail
var indexRouter = require('./routes/index')(app, DriveInfo, SmtpPool, KarforuInfo);
var pushRouter = require('./routes/push')(app, pushServerKey);
var mailRouter = require('./routes/smtp')(app, SmtpPool, KarforuInfo);

// yhkim add
var ssRouter = require('./routes/ss')(app,SmtpPool,pushServerKey, ShuttleTimes,SsUser);

//아래와 같이 rest api 라우터를 분리한다. 주석
app.use('/', indexRouter);
app.use('/push', pushRouter);
app.use('/smtp', mailRouter);
app.use('/ss', ssRouter);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port);
});
