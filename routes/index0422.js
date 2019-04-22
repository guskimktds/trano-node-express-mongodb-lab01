//./routes/p1.js
module.exports = function(app){//함수로 만들어 객체 app을 전달받음
	var express = require('express');
	var router = express.Router();
	router.get('/r1', function(req, res){
		res.send('Hello /p1/r1');
	});

	router.get('/r2', function(req, res){
		res.send('Hello /p1/r2');
	});
	return router;	//라우터를 리턴
};

// //라우터에서 Book 모델을 사용해야 하므로 Book sckema 를 전달한다.
// const nodemailer = require('nodemailer');
//
// module.exports = function(app, DriveInfo, SmtpPool, pushServerKey, KarforuInfo)
// {
//     // GET ALL BOOKS
//     app.get('/', function(req,res){
//         console.log("정상완료");
//         res.end();
//     });
//
//     app.post('/api/karforuInfo', function(req, res){
//         var karforu = new KarforuInfo();
//         karforu.name = req.body.name;
//         karforu.sabun = req.body.sabun;
//         karforu.tel = req.body.tel;
//         karforu.email = req.body.email;
//         karforu.author = req.body.author;
//         karforu.pushToken = req.body.pushToken;
//         karforu.pushTokenCreate = getCurrentDate();
//
//         karforu.sendauth = getCurrentDate();
//         karforu.verify = 'notyet';
//
//         karforu.save(function(err){
//             if(err){
//                 console.error(err);
//                 res.json({result: 0});
//                 return;
//             }
//             res.json({result: 1});
//         });
//     });

//     app.get('/api/karforuInfo', function(req,res){
//         KarforuInfo.find(function(err, driveInfos){
//             if(err) return res.status(500).send({error: 'database failure'});
//             res.json(driveInfos);
//         })
//     });
//
//     // 출발지/도착지(waypoint or destination)로 조회
//     app.get('/api/karforuInfo/waypoint/:waypoint', function(req, res){
//         KarforuInfo.find( {$or: [{ "driveInfo": { $elemMatch: { "route.waypoint": {$regex:req.params.waypoint} }  } },{ "driveInfo": { $elemMatch: { "route.destination": {$regex:req.params.waypoint} }  } }] },
//           function(err, driveInfos){
//             if(err) return res.status(500).json({error: err});
//             if(driveInfos.length === 0) return res.status(404).json({error: 'driveInfos not found'});
//             res.json(driveInfos);
//         })
//     });
//
//     // // UPDATE THE BOOK
//     // app.put('/api/books/:book_id', function(req, res){
//     //     res.end();
//     // });
//
//
//
//
//   //////////////////////////////////////////////////////////////////
//
//   // GET ALL BOOKS
//   // 데이터 조회시 find() 메소드 이용, 파라미터가 없을 경우 전부 조회
//   app.get('/api/driveInfos', function(req,res){
//       DriveInfo.find(function(err, driveInfos){
//           if(err) return res.status(500).send({error: 'database failure'});
//           res.json(driveInfos);
//       })
//   });
//
//   // GET SINGLE BOOK
//   app.get('/api/driveInfos/:driveInfo_id', function(req, res){
//       DriveInfo.findOne({_id: req.params.book_id}, function(err,driveInfo){
//         if(err) return res.status(500).json({error: err});
//         if(!driveInfo) return res.status(404).json({error: 'driveInfo not found'});
//         res.json(driveInfo);
//       })
//       //res.end();
//   });
//
// // // GET BOOK BY AUTHOR
// // app.get('/api/books/author/:author', function(req, res){
// //     res.end();
// // });
//
// /*
// waypoint: String,
// destination: String,
// start_time: String,
// term: String,
// personnel: String,
// status: String,
// drivername: String,
// custno: String,
// phone: String
// */
//
//   // 경유지(waypoint)로 조회
//   app.get('/api/driveInfos/waypoint/:waypoint', function(req, res){
//       DriveInfo.find({waypoint: req.params.waypoint},
//         { _id: 0,
//           waypoint: 1,
//           destination: 1,
//           start_time: 1,
//           term: 1,
//           personnel: 1,
//           status: 1
//           },  function(err, driveInfos){
//           if(err) return res.status(500).json({error: err});
//           if(driveInfos.length === 0) return res.status(404).json({error: 'driveInfos not found'});
//           res.json(driveInfos);
//       })
//   });
//
// // CREATE BOOK
// // app.post('/api/books', function(req, res){
// //     res.end();
// // });
// // create Post /api/books
// // driveInfos 데이터를 DB 에 저장하는 API
// /*
// waypoint: String,
// destination: String,
// start_time: String,
// term: String,
// personnel: String,
// status: String,
// drivername: String,
// custno: String,
// phone: String
// */
//   app.post('/api/driveInfos', function(req, res){
//       var driveInfo = new DriveInfo();
//       driveInfo.waypoint = req.body.waypoint;
//       driveInfo.destination = req.body.destination;
//       driveInfo.start_time = req.body.start_time;
//       driveInfo.term = req.body.term;
//       driveInfo.personnel = req.body.personnel;
//       driveInfo.status = req.body.status;
//       driveInfo.drivername = req.body.drivername;
//       driveInfo.custno = req.body.custno;
//       driveInfo.phone = req.body.phone;
//
//       driveInfo.save(function(err){
//           if(err){
//               console.error(err);
//               res.json({result: 0});
//               return;
//           }
//
//           res.json({result: 1});
//
//       });
//   });
//
// // // UPDATE THE BOOK
// // app.put('/api/books/:book_id', function(req, res){
// //     res.end();
// // });
//
// // UPDATE THE BOOK
// // id 에 해당하는 데이터를 찾아서(findById) 전달받은 값(req.body..)으로 변경(save)해준다.
// /*
// waypoint: String,
// destination: String,
// start_time: String,
// term: String,
// personnel: String,
// status: String,
// drivername: String,
// custno: String,
// phone: String
// */
//
//   app.put('/api/driveInfos/:driveInfo_id', function(req, res){
//       DriveInfo.findById(req.params.driveInfo_id, function(err, driveInfo){
//           if(err) return res.status(500).json({ error: 'database failure' });
//           if(!driveInfo) return res.status(404).json({ error: 'driveInfo not found' });
//
//           if(req.body.waypoint) driveInfo.waypoint = req.body.waypoint;
//           if(req.body.destination) driveInfo.destination = req.body.destination;
//           if(req.body.start_time) driveInfo.start_time = req.body.start_time;
//           if(req.body.term) driveInfo.term = req.body.term;
//           if(req.body.personnel) driveInfo.personnel = req.body.personnel;
//
//
//           driveInfo.save(function(err){
//               if(err) res.status(500).json({error: 'failed to update'});
//               res.json({message: 'driveInfo updated'});
//           });
//
//       });
//
//   });
//
// // // DELETE BOOK
// // app.delete('/api/books/:book_id', function(req, res){
// //     res.end();
// // });
//
//   // DELETE BOOK
//   // book_id 에 해당하는 데이터 제거
//   app.delete('/api/driveInfos/:driveInfo_id', function(req, res){
//       DriveInfo.remove({ _id: req.params.driveInfo_id }, function(err, output){
//           if(err) return res.status(500).json({ error: "database failure" });
//
//           /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
//           if(!output.result.n) return res.status(404).json({ error: "book not found" });
//           res.json({ message: "book deleted" });
//           */
//
//           res.status(204).end();
//       })
//   });
//
//  var rand,mailOptions,host,link;
//  var smtpTransport=nodemailer.createTransport(SmtpPool);
//
//  app.post('/api/authmail',function(req,res){
//    rand=req.body.sabun +'|'+ Math.floor((Math.random() * 100) + 54);
//    console.log("authmail rand : "+rand);
//    host=req.get('host');
//    link="http://"+req.get('host')+"/api/verify?id="+rand;
//    mailOptions={
//      to : req.body.toMail,
//      //to: 'anni4ever@naver.com',
//      //to: 'gusraccoon@gmail.com',
//      subject : "Please confirm your Email account",
//      html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
//    }
//    console.log(mailOptions);
//    smtpTransport.sendMail(mailOptions, function(error, response){
//      if(error){
//         console.log(error);
//         res.end("error");
//      }else{
//         console.log("Message sent: " + response.message);
//         res.end("sent");
//      }
//    });
//  });
//
//  app.get('/api/verify',function(req,res){
//    console.log(req.protocol+":/"+req.get('host'));
//    if((req.protocol+"://"+req.get('host'))==("http://"+host)){
//      console.log("verify rand : "+rand+",  req.query.id : "+req.query.id);
//      if(req.query.id==rand){
//        console.log("email is verified");
//        let userkey = req.query.id.split('|');
//
//        //메일인증완료
//        res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
//        //인증일시 DB저장
//        _verifyUpdate(userkey[0]);
//        //res.redirect("/");
//      }
//      else {
//        console.log("email is not verified");
//        res.end("<h1>Bad Request</h1>");
//      }
//    }
//    else
//    {
//      res.end("<h1>Request is from unknown source");
//    }
//  });
//
//  function _verifyUpdate(userkey){
//    console.log("callback param: "+userkey);
//    var verifyed = getCurrentDate();
//
//    KarforuInfo.update({ sabun: userkey }, { $set: { verify : verifyed} }, function(err, output){
//         //if(err) res.status(500).json({ error: 'database failure' });
//         if(err) console.log("error : database failure"); //error log
//         console.log(output);
//         if(!output.n) return; //error event
//         //res.json( { message: 'KarforuInfo updated' } );
//         console.log('KarforuInfo updated Successfully');
//     });
//
//  }
//
//  //기존 값을 업데이트 처리할때 save 를 사용하면
//  //save function is not defined 에러가 발생하여 upade method 사용함
//  app.get('/api/karforuInfos/verify/:verify', function(req, res){
//    // KarforuInfo.find({email: req.params.verify}, function(err, karforuInfo){
//    //     if(err) return res.status(500).json({ error: 'database failure' });
//    //     if(!karforuInfo) return res.status(404).json({ error: 'karforuInfo not found' });
//    //
//    //     console.log("karforuInfo : "+karforuInfo);
//    //     karforuInfo.verify = getCurrentDate();
//    //     karforuInfo.save(function(err){
//    //         if(err) res.status(500).json({error: 'failed to update'});
//    //         res.json({message: 'karforuInfo updated'});
//    //         console.log("Auth verify Update Successfully")
//    //     });
//    // });
//    var verifyed = getCurrentDate();
//
//    KarforuInfo.update({ email: req.params.verify }, { $set: { verify : verifyed} }, function(err, output){
//         if(err) res.status(500).json({ error: 'database failure' });
//         console.log(output);
//         if(!output.n) return res.status(404).json({ error: 'KarforuInfo not found' });
//         res.json( { message: 'KarforuInfo updated' } );
//     })
//   });
//
//   //메일 발송
//   app.post("/api/sendmail", function(req, res, next){
//
//       var mailOpt={
//           from: req.body.fromAddress,
//           to: req.body.toAddress, // [] 배열로 여러건에 메일주소로 발송 가능
//           subject: req.body.subject,
//           html: req.body.contents
//       }
//       smtpTransport.sendMail(mailOpt, function(err, res) {
//           if( err ) {
//               console.log(err);
//           }else{
//               console.log('Message send :'+ res);
//           }
//           smtpTransport.close();
//       })
//       res.redirect("/");
//   });
//
//   app.post("/api/sendpush", function(req, res, next){
//
//     var FCM = require('fcm-node');
//     /** Firebase(구글 개발자 사이트)에서 발급받은 서버키 */
//     // 가급적 이 값은 별도의 설정파일로 분리하는 것이 좋다.
//
//     /** 안드로이드 단말에서 추출한 token값 */
//     // 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
//     // 안드로이드 단말에서 Node server로 POST방식 전송 후,
//     // Node서버는 이 값을 DB에 보관하고 있으면 된다.
//     var client_token = 'dfip14KVzaU:APA91bFC1CLQ1yu-8pEMDDTYS3v9Cge2cNCWMdepEAKgzxhez0_YyHakoj7cGL5xMakJAgO1FKn5CnbIsgzkjkKn1Q54zZ1JPygXqOg_GOfhpcpXXiypBNifqGa_myLTZquWa5IodJ8K';
//     client_token = 'd2AkvFHo0WY:APA91bGdCtk_c0ToCjDGpymgxPMoA7daX50nb1tnm6SfrnZU2JQIWu6qz2L_QHCYAVzk6z4IHdXUmL2y0iMIS2DyktuOowMUJID7Rs_-eDghShhsg0dDLp9J__lxHcGrQCIL8knOSDvP';
//     var title, contents, sound, click_action, icon, priority, restricted_package_name, data, pushToken;
//
//     if(req.body !== 'null') {
//       console.log("req.body.title : "+req.body.title);
//       console.log("req.body.contents : "+req.body.contents);
//       console.log("req.body.sound : "+req.body.sound);
//       console.log("req.body.click_action : "+req.body.click_action);
//       console.log("req.body.icon : "+req.body.icon);
//       console.log("req.body.priority : "+req.body.priority);
//       console.log("req.body.restricted_package_name : "+req.body.restricted_package_name);
//       console.log("req.body.data : "+req.body.data);
//       console.log("req.body.pushToken : "+req.body.pushToken);
//     }
//     //client_token = req.body.pushToken;
//     /** 발송할 Push 메시지 내용 */
//     var push_data = {
//         // 수신대상
//         to: client_token,
//         // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
//         notification: {
//             title: req.body.title,
//             body: req.body.contents,
//             sound: req.body.sound,
//             click_action: "FCM_PLUGIN_ACTIVITY",
//             icon: "ic_launcher"
//         },
//         // 메시지 중요도
//         priority: "high",
//         // App 패키지 이름
//         restricted_package_name: "com.karforu",
//         // App에게 전달할 데이터
//         data: {
//             memo1 : '5분후 탑승',
//             memo2 : '회원가입 완료'
//         }
//     };
//
//     var serverKey = pushServerKey;
//     console.log("serverKey : "+serverKey);
//     /** 아래는 푸시메시지 발송절차 */
//     var fcm = new FCM(serverKey);
//     fcm.send(push_data, function(err, response) {
//         if (err) {
//             console.error('Push메시지 발송에 실패했습니다.');
//             console.error(err);
//             return;
//         }
//         console.log('Push메시지가 발송되었습니다.');
//         console.log(response);
//     });
//     res.redirect("/");
//   });
//
//
//   function getCurrentDate(){
//     var now = new Date();
//     var year = now.getFullYear();
//     var month = now.getMonth();
//     var date = now.getDate();
//
//     var hours = addZeros(now.getHours(),2);
//     var minutes = addZeros(now.getMinutes() ,2);
//     var seconds =  addZeros(now.getSeconds(),2);
//
//     var _date = year+'/'+('0'+month).slice(-2)+'/'+('0'+date).slice(-2)+' '+hours+':'+minutes+':'+seconds;
//
//     return _date;
//   }
//
//   // 자리수 맟추기
//   function addZeros(num, digit) {
//     var zero = '';
//     num = num.toString();
//     if (num.length < digit) {
//       for (i = 0; i < digit - num.length; i++) {
//         zero += '0';
//       }
//     }
//     return zero + num;
//   }
//
// }
