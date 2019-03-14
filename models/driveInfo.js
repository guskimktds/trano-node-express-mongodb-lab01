//아래와 같이 Schema를 작성, scheam는 document의 구조가 어떻게 생겼는지 알려준다.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var driveInfoSchema = new Schema({
    waypoint: String,
    destination: String,
    start_time: String,
    term: String,
    personnel: String,
    status: String,
    drivername: String,
    custno: String,
    phone: String
});

module.exports = mongoose.model('driveInfo', driveInfoSchema);
