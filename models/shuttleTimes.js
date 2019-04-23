var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shuttleTimesSchema = new Schema({
    bundang: [new Schema({title: String, isAvailable: Boolean})],
    bangbae: [new Schema({title: String, isAvailable: Boolean})]
});

module.exports = mongoose.model('shuttleTimes', shuttleTimesSchema);
