// //./routes/p1.js
// module.exports = function(app){//함수로 만들어 객체 app을 전달받음
// 	var express = require('express');
// 	var router = express.Router();
//
// 	router.get('/r1', function(req, res){
// 		res.send('Hello /p1/r1');
// 	});
//
// 	router.get('/r2', function(req, res){
// 		res.send('Hello /p1/r2');
// 	});
// 	return router;	//라우터를 리턴
// };

//라우터에서 Book 모델을 사용해야 하므로 Book sckema 를 전달한다.
const nodemailer = require('nodemailer');

module.exports = function(app, DriveInfo, SmtpPool, KarforuInfo)
{
		var express = require('express');
		var router = express.Router();
    // GET ALL BOOKS
    router.get('/', function(req,res){
        console.log("정상완료");
        res.end();
    });

		//카풀정보 저장
    router.post('/karforuInfo', function(req, res){
        var karforu = new KarforuInfo();
        karforu.name = req.body.name;
        karforu.sabun = req.body.sabun;
        karforu.tel = req.body.tel;
        karforu.email = req.body.email;
        karforu.author = req.body.author;
        karforu.pushToken = req.body.pushToken;
        karforu.pushTokenCreate = getCurrentDate();

        karforu.sendauth = getCurrentDate();
        karforu.verify = 'notyet';

        karforu.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1});
        });
    });

		//카풀정보 전체목록 조회
    router.get('/karforuInfo', function(req,res){
        KarforuInfo.find(function(err, driveInfos){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(driveInfos);
        })
    });

    // 출발지/도착지(waypoint or destination)로 조회
    router.get('/karforuInfo/waypoint/:waypoint', function(req, res){
        KarforuInfo.find( {$or: [{ "driveInfo": { $elemMatch: { "route.waypoint": {$regex:req.params.waypoint} }  } },{ "driveInfo": { $elemMatch: { "route.destination": {$regex:req.params.waypoint} }  } }] },
          function(err, driveInfos){
            if(err) return res.status(500).json({error: err});
            if(driveInfos.length === 0) return res.status(404).json({error: 'driveInfos not found'});
            res.json(driveInfos);
        })
    });

	  // 사번으로 조회 카풀정보
	  router.get('/karforuInfo/:sabun', function(req, res){
	      DriveInfo.findOne({_id: req.params.sabun}, function(err,driveInfo){
	        if(err) return res.status(500).json({error: err});
	        if(!driveInfo) return res.status(404).json({error: 'driveInfo not found'});
	        res.json(driveInfo);
	      })
	      //res.end();
	  });

	  // 메일주소(email)로 운전자/탑승자 조회
	  router.get('/karforuInfo/:email', function(req, res){
	      DriveInfo.find({waypoint: req.params.email},
	        { name: 1,
	          sabun: 1,
	          tel: 1,
	          email: 1
	          },  function(err, driveInfos){
	          if(err) return res.status(500).json({error: err});
	          if(driveInfos.length === 0) return res.status(404).json({error: 'driveInfos not found'});
	          res.json(driveInfos);
	      })
	  });

		// 메일주소(email)로 운전자/탑승자 정보 조회
	  router.get('/karforuInfo/:email', function(req, res){
	      DriveInfo.find({waypoint: req.params.email},
	        { name: 1,
	          sabun: 1,
	          tel: 1,
	          email: 1
	          },  function(err, driveInfos){
	          if(err) return res.status(500).json({error: err});
	          if(driveInfos.length === 0) return res.status(404).json({error: 'driveInfos not found'});
	          res.json(driveInfos);
	      })
	  });


	  // email 키값으로 회원탈퇴 시 고객정보 완전삭제
	  router.delete('/karforuInfo/:email', function(req, res){
	      DriveInfo.remove({ _id: req.params.email }, function(err, output){
	          if(err) return res.status(500).json({ error: "database failure" });
	          /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
	          if(!output.result.n) return res.status(404).json({ error: "book not found" });
	          res.json({ message: "book deleted" });
	          */
	          res.status(204).end();
	      })
	  });

	 //인증메일, 인증처리, 메일발송, push
	 var rand,mailOptions,host,link;
	 var smtpTransport=nodemailer.createTransport(SmtpPool);

	 router.post('/authmail',function(req,res){
	   rand=req.body.sabun +'|'+ Math.floor((Math.random() * 100) + 54);
	   console.log("authmail rand : "+rand);
	   host=req.get('host');
	   link="http://"+req.get('host')+"/verify?id="+rand;
	   mailOptions={
	     to : req.body.toMail,
	     //to: 'anni4ever@naver.com',
	     //to: 'gusraccoon@gmail.com',
	     subject : "Please confirm your Email account",
	     html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
	   }
	   console.log(mailOptions);
	   smtpTransport.sendMail(mailOptions, function(error, response){
	     if(error){
	        console.log(error);
	        res.end("error");
	     }else{
	        console.log("Message sent: " + response.message);
	        res.end("sent");
	     }
	   });
	 });

	 //수신메일 인증처리
	 router.get('/verify',function(req,res){
	   console.log(req.protocol+":/"+req.get('host'));
	   if((req.protocol+"://"+req.get('host'))==("http://"+host)){
	     console.log("verify rand : "+rand+",  req.query.id : "+req.query.id);
	     if(req.query.id==rand){
	       console.log("email is verified");
	       let userkey = req.query.id.split('|');

	       //메일인증완료
	       res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
	       //인증일시 DB저장
	       _verifyUpdate(userkey[0]);
	       //res.redirect("/");
	     }
	     else {
	       console.log("email is not verified");
	       res.end("<h1>Bad Request</h1>");
	     }
	   }
	   else
	   {
	     res.end("<h1>Request is from unknown source");
	   }
	 });

	 function _verifyUpdate(userkey){
	   console.log("callback param: "+userkey);
	   var verifyed = getCurrentDate();

	   KarforuInfo.update({ sabun: userkey }, { $set: { verify : verifyed} }, function(err, output){
	        //if(err) res.status(500).json({ error: 'database failure' });
	        if(err) console.log("error : database failure"); //error log
	        console.log(output);
	        if(!output.n) return; //error event
	        //res.json( { message: 'KarforuInfo updated' } );
	        console.log('KarforuInfo updated Successfully');
	    });
	 }

	 //기존 값을 업데이트 처리할때 save 를 사용하면
	 //save function is not defined 에러가 발생하여 upade method 사용함
	 router.get('/karforuInfos/verify/:verify', function(req, res){
	   // KarforuInfo.find({email: req.params.verify}, function(err, karforuInfo){
	   //     if(err) return res.status(500).json({ error: 'database failure' });
	   //     if(!karforuInfo) return res.status(404).json({ error: 'karforuInfo not found' });
	   //
	   //     console.log("karforuInfo : "+karforuInfo);
	   //     karforuInfo.verify = getCurrentDate();
	   //     karforuInfo.save(function(err){
	   //         if(err) res.status(500).json({error: 'failed to update'});
	   //         res.json({message: 'karforuInfo updated'});
	   //         console.log("Auth verify Update Successfully")
	   //     });
	   // });
	   var verifyed = getCurrentDate();

	   KarforuInfo.update({ email: req.params.verify }, { $set: { verify : verifyed} }, function(err, output){
	        if(err) res.status(500).json({ error: 'database failure' });
	        console.log(output);
	        if(!output.n) return res.status(404).json({ error: 'KarforuInfo not found' });
	        res.json( { message: 'KarforuInfo updated' } );
	    })
	  });

	  //일반 메일 발송
	  router.post("/sendmail", function(req, res, next){

	      var mailOpt={
	          from: req.body.fromAddress,
	          to: req.body.toAddress, // [] 배열로 여러건에 메일주소로 발송 가능
	          subject: req.body.subject,
	          html: req.body.contents
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
	  });



		//날짜구하기 함수
	  function getCurrentDate(){
	    var now = new Date();
	    var year = now.getFullYear();
	    var month = now.getMonth();
	    var date = now.getDate();

	    var hours = addZeros(now.getHours(),2);
	    var minutes = addZeros(now.getMinutes() ,2);
	    var seconds =  addZeros(now.getSeconds(),2);

	    var _date = year+'/'+('0'+month).slice(-2)+'/'+('0'+date).slice(-2)+' '+hours+':'+minutes+':'+seconds;

	    return _date;
	  }

	  // 자리수 맟추기
	  function addZeros(num, digit) {
	    var zero = '';
	    num = num.toString();
	    if (num.length < digit) {
	      for (i = 0; i < digit - num.length; i++) {
	        zero += '0';
	      }
	    }
	    return zero + num;
	  }

		return router;	//라우터를 리턴

}
