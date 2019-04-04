/** fcm-node 모듈 설치 필요 */
// --> npm install fcm-mode --save
var FCM = require('fcm-node');

/** Firebase(구글 개발자 사이트)에서 발급받은 서버키 */
// 가급적 이 값은 별도의 설정파일로 분리하는 것이 좋다.
var serverKey = 'AAAA69RMFTg:APA91bHelwoSOLvR-giVO_Q_VScLJCedCcdsrtrw9GP06v-eca-G_r6-IyWEmOWze_KJpPu8xj6N6kr5F6fTDTqlkmtyKsQ6WU_TJy1l-RFBwS9Cq-fqFk7Z5KJX567B9oa7T5OE48jg';

/** 안드로이드 단말에서 추출한 token값 */
// 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
// 안드로이드 단말에서 Node server로 POST방식 전송 후,
// Node서버는 이 값을 DB에 보관하고 있으면 된다.
var client_token = 'dfip14KVzaU:APA91bFC1CLQ1yu-8pEMDDTYS3v9Cge2cNCWMdepEAKgzxhez0_YyHakoj7cGL5xMakJAgO1FKn5CnbIsgzkjkKn1Q54zZ1JPygXqOg_GOfhpcpXXiypBNifqGa_myLTZquWa5IodJ8K';

/** 발송할 Push 메시지 내용 */
var push_data = {
    // 수신대상
    to: client_token,
    // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
    notification: {
        title: "Hello Node",
        body: "Node로 발송하는 Push 메시지 입니다.",
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon"
    },
    // 메시지 중요도
    priority: "high",
    // App 패키지 이름
    restricted_package_name: "com.fcmtest",
    // App에게 전달할 데이터
    data: {
        num1: 2000,
        num2: 3000
    }
};

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
