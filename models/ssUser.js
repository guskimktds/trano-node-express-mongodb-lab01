//아래와 같이 Schema를 작성, scheam는 document의 구조가 어떻게 생겼는지 알려준다.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ssUserScheme = new Schema({
    id: String,
    pw: String,
    email:String,
    push_token:String,
    login_token:String,
    register_confirm: {
        type: Boolean,
        default: false
    },
    validate_email:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ssUser', ssUserScheme);
