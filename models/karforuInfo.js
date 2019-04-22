//아래와 같이 Schema를 작성, scheam는 document의 구조가 어떻게 생겼는지 알려준다.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var karforuInfoSchema = new Schema({
    name: String,
    sabun: String,
    tel: String,
    email: String,
    sendauth: String,
    verify: String,
    author: String,
    pushToken: String,
    pushTokenCreate: String,
    driveInfo: [ {driveInfoKey:String, route : { waypoint : String, destination : String, start_time: String, end_time : String, passengers : String, status : String, registDate : String },
            schedule : { driveType: String, drivingStartDate : String, drivingEndDate : String, nonDriving : String },
            passengerInfo : [ { name : String, phone : String, email : String } ] } ],
    carInfo: { owner : String, number : String, type : String, insurance : String },
    rideInfo: String
});

module.exports = mongoose.model('karforuInfo', karforuInfoSchema);
