//아래와 같이 Schema를 작성, scheam는 document의 구조가 어떻게 생겼는지 알려준다.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    author: String,
    published_date: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('book', bookSchema);
