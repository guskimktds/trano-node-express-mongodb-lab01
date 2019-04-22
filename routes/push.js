module.exports = function(app, pushServerKey)
{
    var express = require('express');
    var router = express.Router();

    // GET ALL BOOKS
    router.get('/', function(req,res){
        console.log("/push 정상완료");
        res.end();
    });

    //Push 발송
    router.post("/send", function(req, res, next){

      var FCM = require('fcm-node');
      /** Firebase(구글 개발자 사이트)에서 발급받은 서버키 */
      // 가급적 이 값은 별도의 설정파일로 분리하는 것이 좋다.

      /** 안드로이드 단말에서 추출한 token값 */
      // 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
      // 안드로이드 단말에서 Node server로 POST방식 전송 후,
      // Node서버는 이 값을 DB에 보관하고 있으면 된다.
      var client_token = 'dfip14KVzaU:APA91bFC1CLQ1yu-8pEMDDTYS3v9Cge2cNCWMdepEAKgzxhez0_YyHakoj7cGL5xMakJAgO1FKn5CnbIsgzkjkKn1Q54zZ1JPygXqOg_GOfhpcpXXiypBNifqGa_myLTZquWa5IodJ8K';
      client_token = 'd2AkvFHo0WY:APA91bGdCtk_c0ToCjDGpymgxPMoA7daX50nb1tnm6SfrnZU2JQIWu6qz2L_QHCYAVzk6z4IHdXUmL2y0iMIS2DyktuOowMUJID7Rs_-eDghShhsg0dDLp9J__lxHcGrQCIL8knOSDvP';
      var title, contents, sound, click_action, icon, priority, restricted_package_name, data, pushToken;

      if(req.body !== 'null') {
        console.log("req.body.title : "+req.body.title);
        console.log("req.body.contents : "+req.body.contents);
        console.log("req.body.sound : "+req.body.sound);
        console.log("req.body.click_action : "+req.body.click_action);
        console.log("req.body.icon : "+req.body.icon);
        console.log("req.body.priority : "+req.body.priority);
        console.log("req.body.restricted_package_name : "+req.body.restricted_package_name);
        console.log("req.body.data : "+req.body.data);
        console.log("req.body.pushToken : "+req.body.pushToken);
      }
      //client_token = req.body.pushToken;
      /** 발송할 Push 메시지 내용 */
      var push_data = {
          // 수신대상
          to: client_token,
          // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
          notification: {
              title: req.body.title,
              body: req.body.contents,
              sound: req.body.sound,
              click_action: "FCM_PLUGIN_ACTIVITY",
              icon: "ic_launcher"
          },
          // 메시지 중요도
          priority: "high",
          // App 패키지 이름
          restricted_package_name: "com.karforu",
          // App에게 전달할 데이터
          data: {
              memo1 : '5분후 탑승',
              memo2 : '회원가입 완료'
          }
      };

      var serverKey = pushServerKey;
      console.log("serverKey : "+serverKey);
      /** 아래는 푸시메시지 발송절차 */
      var fcm = new FCM(serverKey);
      fcm.send(push_data, function(err, response) {
          if (err) {
              console.error('Push메시지 발송에 실패했습니다.');
              console.error(err);
              return;
          }
          console.log('Push메시지가 발송되었습니다.');
          console.log(response);
      });
      res.redirect("/push");
    });

  return router;	//라우터를 리턴

}
