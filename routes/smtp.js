//라우터에서 Book 모델을 사용해야 하므로 Book sckema 를 전달한다.
const nodemailer = require('nodemailer');

module.exports = function(app, SmtpPool, KarforuInfo)
{
		var express = require('express');
		var router = express.Router();
    // GET ALL BOOKS
    router.get('/', function(req,res){
        console.log("/smtp 정상완료");
        res.end();
    });

	 //인증메일, 인증처리, 메일발송, push
	 var rand,mailOptions,host,link;
	 var smtpTransport=nodemailer.createTransport(SmtpPool);

	 router.post('/auth',function(req,res){
	   rand=req.body.sabun +'|'+ Math.floor((Math.random() * 100) + 54);
	   console.log("smtp auth mail rand : "+rand);
	   host=req.get('host');
	   link="http://"+req.get('host')+"/smtp/verify?id="+rand;
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

	  //일반 메일 발송
	  router.post("/send", function(req, res, next){

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
	      res.redirect("/smtp");
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
