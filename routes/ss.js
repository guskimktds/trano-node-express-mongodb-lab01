//라우터에서 Book 모델을 사용해야 하므로 Book sckema 를 전달한다.
const nodemailer = require('nodemailer');

// yhkim 추가 , for Email validate when Ss user register
const crypto = require('crypto');
var sha256 = require('../Utils/sha256');

module.exports = function(app,SmtpPool, pushServerKey,ShuttleTimes,SsUser)
{
    // <------ yhkim 추가 시작 ------->
    var express = require('express');
    var router = express.Router();

    var rand,mailOptions,host,link;
    var smtpTransport=nodemailer.createTransport(SmtpPool);

    var encryptionHelper = require("../Utils/enc-dec-util.js")
    var algorithm = encryptionHelper.CIPHERS.AES_256;

    // 회원가입
    router.post('/api/regiUser', function(req, res){
      var ssUser = new SsUser();
      ssUser.id = req.body.id;
      ssUser.pw = req.body.pw;
      ssUser.email = req.body.email;
      ssUser.register_confirm = false;
      ssUser.validate_email = false;
      ssUser.save(function(err){
        if(err){
          console.error(err);
          res.json({resCode:401, resMsg: "회원가입 오류"});
          return;
        }
        else {

          let encText = encryptionHelper.encrypt('data|' + ssUser.id);
          console.log("encrypted text = " + encText);

          host=req.get('host');
          link="http://"+req.get('host')+"/ss/verify?id="+encodeURI(encText);

          console.log("link : " + link);
          mailOptions={
            to : req.body.email,
            //to: 'anni4ever@naver.com',
            //to: 'gusraccoon@gmail.com',
            subject : "KT DS 셔틀 사송 회원가입 확인",
            html : "안녕하세요. KT DS 입니다.<br> 아래 회원가입 확인 링크를 눌러 이메일 인증을 완료해 주세요.<br>인증 완료 시, 관리자 승인 후 최종 가입 완료 됩니다.<br><a href="+link+">회원가입 확인</a>"
          }
          console.log(mailOptions);
          smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
              console.log(error);
              res.json({resCode:402, resMsg: "이메일 전송 오류"});
              return;
            }else{
              console.log("Message sent: " + res.message);
              res.json({resCode:200, resMsg: "회원 가입 완료"});
              return;
            }
          });
        }
      });
    });

    // 사용자 회원 가입 시 이메일 링크로 보낸 url 유효성 검증
    router.get('/verify',function(req,res){
      console.log(req.protocol+":/"+req.get('host'));
      if((req.protocol+"://"+req.get('host'))==("http://"+host)){

          console.log("ecrypted text from id = " + decodeURI(req.query.id));
          // var decText = encryptionHelper.decryptText(algorithm, data.key, data.iv, decodeURI(req.query.id), "base64");

          var decText = encryptionHelper.decrypt(decodeURI(req.query.id));

          console.log("decrypted text = " + decText);

          let userkey = decText.split('|');

          if(userkey[1]) {
            //메일인증완료
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end("<h1>Email 인증이 완료되었습니다. <br>관리자 승인 후 최종 가입 완료 됩니다.(최장 1일 소요)</h1>");

            // 이메일 인증 여부 갱신
            SsUser.update({ id: userkey[1] }, { $set: { validate_email : true} }, function(err, output){
              //if(err) res.status(500).json({ error: 'database failure' });
              if(err) console.log("error : database failure"); //error log
              console.log(output);
              if(!output.n) res.json( { resCode: 403, resMsg:"validation error" } ); //error event

              console.log('SsUser updated Successfully');
              return;
              // res.json( { resCode: 200 } );
            });
          }
          else {
            console.log("email is not verified");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end("<h1>잘못된 접근입니다.</h1>");
          }
      }
      else
      {
        res.end("Request is from unknown source");
      }
    });

    // 사용자 이메일 인증 후 관리자 승인 완료 처리
    router.post('/api/confirmUser' , function(req,res) {
      SsUser.update({ id: req.body.id }, {register_confirm:req.body.register}, function(err, output){
        //if(err) res.status(500).json({ error: 'database failure' });
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          console.log(err);
        }
        res.json({ resCode: 200, resMsg:'OK' });
      });
    });


    // 로그아웃
    router.post('/api/logout' , function(req,res) {
      SsUser.find({ "login_token": req.body.login_token } ,function(err, userInfos){
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          return;
        }
        if(!userInfos || userInfos.length === 0) {
          res.json({ resCode: 201, resMsg:'잘못된 토큰값입니다.' });
          return;
        }

        SsUser.update({ id: userInfos[0].id },{login_token:""}, function(err, output){
          //if(err) res.status(500).json({ error: 'database failure' });
          if(err) {
            res.json({ resCode: 501, resMsg:err });
            console.log(err);
            return;
          }
          res.json({ resCode: 200, resMsg:'OK' });
          console.log('logout success');
          return;
        });
      })
    });

    // 회원 탈퇴
    router.delete('/api/withraw' , function(req,res) {
      SsUser.deleteOne({ login_token: req.body.login_token } ,function(err, userInfos){
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          return;
        }
        if(!userInfos || userInfos.length === 0) {
          res.json({ resCode: 201, resMsg:'잘못된 토큰값입니다.' });
          return;
        }
        res.json({ resCode: 200, resMsg:'OK' });
        console.log('withraw success');
      })
    });


    // 회원가입 시 사번 중복 확인
    router.post('/api/checkUserDupl', function(req,res){
      SsUser.find({ "id": req.body.id  } ,function(err, userInfos){
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          return;
        }
        if(!userInfos || userInfos.length === 0) {
          res.json({ resCode: 200, resMsg:'사용 할 수 있는 아이디입니다' });
          return;
        }
        res.json({ resCode: 201, resMsg:'이미 등록 된 아이디입니다' });
      })
    });

    // id/pw 사용자 로그인
    router.post('/api/login', function(req,res){
      SsUser.find({ "id": req.body.id , "pw":req.body.pw} ,
      function(err, userInfos){
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          return;
        }
        if(!userInfos || userInfos.length === 0) {
          res.json({ resCode: 202, resMsg:'사번/비밀번호를 확인하세요' });
          return;
        }
        console.log("userInfos : " + userInfos);

        if(userInfos[0].validate_email !== true) {
          res.json({ resCode: 203, resMsg:'이메일 인증을 확인하세요' });
          return;
        }

        if(userInfos[0].register_confirm !== true) {
          res.json({ resCode: 204, resMsg:'관리자 승인 후 로그인 가능합니다' });
          return;
        }

        // 클라이언트에서 로그인 유지 체크 시, 로그인 토큰 response
        if(req.body.auto_login === true) {
          let userId = req.body.id;
          let now = new Date();
          let login_token = encryptionHelper.encrypt(now.getTime() + "|" + userId );
          SsUser.update({ id: req.body.id }, { $set: { login_token : login_token} }, function(err, output){
            //if(err) res.status(500).json({ error: 'database failure' });
            if(err) {
              console.log("error : database failure"); //error log
            }
            console.log(output);
            if(!output.n) {
              res.json( { resCode: 403, resMsg:"cannot make login token" } ); //error event
              return;
            }
            console.log('SsUser login_token updated Successfully');
            res.json({ resCode: 200, resMsg:'OK', login_token:login_token });
          });
        }
        else {
          res.json({ resCode: 200, resMsg:'OK'});
        }
      })
    });

    // 토큰을 통한 사용자 로그인
    router.post('/api/loginWithToken', function(req,res){
      SsUser.find({ "login_token": req.body.login_token } ,
      function(err, userInfos){
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          return;
        }
        // 토큰이 없을 경우
        if(!userInfos || userInfos.length === 0) {
          res.json({ resCode: 202, resMsg:'로그인 토큰이 유효하지 않아 로그인 유지가 해제됩니다' });
          return;
        }

        console.log("loginWithToken userInfos is : " + userInfos);

        // 토큰 생성 후 2주 경과 체크
        let now = new Date();
        let tmp = encryptionHelper.decrypt(userInfos[0].login_token);

        console.log("login_token is : " + tmp);

        let createDt = tmp.split('|')[0];
        let twoWeeks = 1000 * 60 * 60 * 24 * 2 * 7;
        let tenSec = 1000 * 10;  // yhkim test

        console.log("createDt is : " + createDt);
        console.log("tenSec is : " + tenSec);
        console.log("now.getTime() is : " + now.getTime());

        if(Number(createDt) + (twoWeeks) < Number(now.getTime())) {
          res.json({ resCode: 203, resMsg:'로그인 토큰이 만료되어 로그인 유지가 해제됩니다' });
          return;
        }

        console.log("userInfos : " + userInfos);

        // 무조건 로그인 토큰 갱신하여 클라이언트에 전달

        let login_token = encryptionHelper.encrypt(now.getTime()+ "|" + req.body.id);
        SsUser.update({ login_token: req.body.login_token }, { $set: { login_token : login_token} }, function(err, output){
          //if(err) res.status(500).json({ error: 'database failure' });
          if(err) {
            console.log("error : database failure"); //error log
          }
          console.log(output);
          if(!output.n) {
            res.json( { resCode: 403, resMsg:"cannot make login token" } ); //error event
            return;
          }
          console.log('SsUser login_token updated Successfully');
          res.json({ resCode: 200, resMsg:'OK', login_token:login_token });
        });
      })
    });


    // 내 정보 조회
    router.post('/api/myInfo', function(req,res){

      SsUser.find({ login_token: req.body.login_token } , function(err, userInfos){
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          return;
        }
        if(!userInfos || userInfos.length === 0) {
          res.json({ resCode: 202, resMsg:'토큰이 유효하지 않습니다.' });
          return;
        }
        console.log("userInfos : " + userInfos);

        res.json({resCode:200, resMsg: "비밀번호 변경 완료", resData:userInfos[0]});

      })
    });

    // 비밀번호 변경
    router.post('/api/changePwd', function(req,res){

      SsUser.find({ login_token: req.body.login_token } , function(err, userInfos){
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          return;
        }
        if(!userInfos || userInfos.length === 0) {
          res.json({ resCode: 202, resMsg:'토큰이 유효하지 않습니다.' });
          return;
        }
        console.log("userInfos : " + userInfos);

        // let randomHash = sha256(req.body.email +'|'+ Math.floor((Math.random() * 100) + 54));
        // let tmpPw = randomHash.substring(4,10);

        let originPw = req.body.originPw;

        if(userInfos[0].pw != originPw) {
          res.json({ resCode: 202, resMsg:'기존 비밀번호가 일치하지 않습니다.' });
          return;
        }

        // 임시 비밀번호 갱신
        SsUser.update({ id: userInfos[0].id }, { $set: { pw : req.body.pw}} , function(err, output){
          //if(err) res.status(500).json({ error: 'database failure' });
          if(err) console.log("error : database failure"); //error log
          console.log(output);
          if(!output.n) res.json( { resCode: 403, resMsg:"validation error" } ); //error event

          console.log('SsUser update new Pwd Successfully');
          res.json({resCode:200, resMsg: "비밀번호 변경 완료"});
        });
      })
    });


    // 비밀번호 재설정
    router.post('/api/resetPwd', function(req,res){

      SsUser.find({ "id": req.body.id , "email":req.body.email} ,
      function(err, userInfos){
        if(err) {
          res.json({ resCode: 500, resMsg:err });
          return;
        }
        if(!userInfos || userInfos.length === 0) {
          res.json({ resCode: 202, resMsg:'사번/이메일을 확인하세요' });
          return;
        }
        console.log("userInfos : " + userInfos);

        let randomHash = sha256(req.body.email +'|'+ Math.floor((Math.random() * 100) + 54));
        let tmpPw = randomHash.substring(4,10);

        // 임시 비밀번호 갱신
        SsUser.update({ id: req.body.id }, { $set: { pw : sha256(req.body.id + tmpPw)} }, function(err, output){
          //if(err) res.status(500).json({ error: 'database failure' });
          if(err) console.log("error : database failure"); //error log
          console.log(output);
          if(!output.n) res.json( { resCode: 403, resMsg:"validation error" } ); //error event

          console.log('SsUser tmp Pwd updated Successfully');
          host=req.get('host');


          mailOptions={
            to : req.body.email,
            //to: 'anni4ever@naver.com',
            //to: 'gusraccoon@gmail.com',
            subject : "KT DS 셔틀 사송 비밀번호 재설정",
            html : "안녕하세요. KT DS 입니다.<br>임시 비밀번호가 발급 되었습니다.<br>로그인 후 비밀번호 변경하여 사용 부탁드립니다.<br>" + tmpPw
          }
          console.log(mailOptions);
          smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
              console.log(error);
              res.json({resCode:402, resMsg: "이메일 전송 오류"});
              return;
            }else{
              console.log("Message sent: " + res.message);
              res.json({resCode:200, resMsg: "비밀번호 재설정 완료"});
              return;
            }
          });
        });
      })
    });

    // 모든 사송 시간표 가져옴
    router.get('/api/shuttleTimes', function(req,res){
      ShuttleTimes.find(function(err, infos){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(infos);
      })
    });


    // 사송 시간표 입력
    router.post('/api/shuttleTimes', function(req, res){

      var shuttleTimes = new ShuttleTimes();

      for(var i = 0; i < req.body.bangbae.length;i++){
        shuttleTimes.bangbae.push({title: req.body.bangbae[i].title, isAvailable: req.body.bangbae[i].isAvailable});
      }
      for(var i = 0; i < req.body.bundang.length;i++){
        shuttleTimes.bundang.push({title: req.body.bundang[i].title, isAvailable: req.body.bundang[i].isAvailable});
      }
      shuttleTimes.save(function(err){
        if(err){
          console.error(err);
          res.json({result: 0});
          return;
        }
        res.json({result: 1});
      });

    });


    // 모든 사송 시간 가져오기 (테스트용)
    router.get('/api/shuttleTimes', function(req,res){
      ShuttleTimes.find(function(err, infos){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(infos);
      })
    });


    // 모든 사용자 가져오기 (테스트용)
    router.get('/user', function(req,res){
      SsUser.find(function(err, infos){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(infos);
      })
    });


    // 모든 사송 시간 삭제 (테스트용)
    router.delete('/api/shuttleTimes', function(req,res) {
      ShuttleTimes.remove( { }, function(err, output){
        if(err) {
          return res.status(500).json({ error: "database failure" });
        }
        res.json({result: 1});
      })
    });

    // 모든 사용자 삭제 (테스트용)
    router.delete('/api/ssUser', function(req,res) {
      SsUser.remove( { }, function(err, output){
        if(err) {
          return res.status(500).json({ error: "database failure" });
        }
        res.json({result: 1});
      })
    });

    return router;	//라우터를 리턴
  }
