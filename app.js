// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

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
var Book = require('./models/book');
var DriveInfo = require('./models/driveInfo');

// [CONFIGURE ROUTER]
//라우터에서 Book 모델을 사용해야 하므로 Book sckema 를 전달한다.
var router = require('./routes')(app, Book, DriveInfo);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port);
});
