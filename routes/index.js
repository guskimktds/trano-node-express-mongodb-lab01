//라우터에서 Book 모델을 사용해야 하므로 Book sckema 를 전달한다.
module.exports = function(app, Book, DriveInfo)
{
    // GET ALL BOOKS
    // app.get('/api/books', function(req,res){
    //     res.end();
    // });

    // GET ALL BOOKS
    // 데이터 조회시 find() 메소드 이용, sckema Book 모델참고, 파라미터가 없을 경우 전부 조회
    app.get('/api/books', function(req,res){
        Book.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });

    // GET SINGLE BOOK
    app.get('/api/books/:book_id', function(req, res){
        Book.findOne({_id: req.params.book_id}, function(err,book){
          if(err) return res.status(500).json({error: err});
          if(!book) return res.status(404).json({error: 'book not found'});
          res.json(book);
        })
        //res.end();
    });

    // // GET BOOK BY AUTHOR
    // app.get('/api/books/author/:author', function(req, res){
    //     res.end();
    // });

    // GET BOOKS BY AUTHOR
    app.get('/api/books/author/:author', function(req, res){
        Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
            if(err) return res.status(500).json({error: err});
            if(books.length === 0) return res.status(404).json({error: 'book not found'});
            res.json(books);
        })
    });

    // CREATE BOOK
    // app.post('/api/books', function(req, res){
    //     res.end();
    // });
    // create Post /api/books
    // book 데이터를 DB 에 저장하는 API
    app.post('/api/books', function(req, res){
        var book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        book.published_date = new Date(req.body.published_date);

        book.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});

        });
    });

    // // UPDATE THE BOOK
    // app.put('/api/books/:book_id', function(req, res){
    //     res.end();
    // });

    // UPDATE THE BOOK
    // id 에 해당하는 데이터를 찾아서(findById) 전달받은 값(req.body..)으로 변경(save)해준다.
    app.put('/api/books/:book_id', function(req, res){
        Book.findById(req.params.book_id, function(err, book){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!book) return res.status(404).json({ error: 'book not found' });

            if(req.body.title) book.title = req.body.title;
            if(req.body.author) book.author = req.body.author;
            if(req.body.published_date) book.published_date = req.body.published_date;

            book.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'book updated'});
            });

        });

    });

    // UPDATE THE BOOK (ALTERNATIVE)
    // document 를 조회하지 않고 업데이트 하는 방식
    app.put('/api/booksa/:book_id', function(req, res){
        Book.update({ _id: req.params.book_id }, { $set: req.body }, function(err, output){
            if(err) res.status(500).json({ error: 'database failure' });
            console.log(output);
            if(!output.n) return res.status(404).json({ error: 'book not found' });
            res.json( { message: 'book updated' } );
        })
    });

    // // DELETE BOOK
    // app.delete('/api/books/:book_id', function(req, res){
    //     res.end();
    // });

    // DELETE BOOK
    // book_id 에 해당하는 데이터 제거
    app.delete('/api/books/:book_id', function(req, res){
        Book.remove({ _id: req.params.book_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "book not found" });
            res.json({ message: "book deleted" });
            */

            res.status(204).end();
        })
    });



//////////////////////////////////////////////////////////////////

// GET ALL BOOKS
// 데이터 조회시 find() 메소드 이용, sckema Book 모델참고, 파라미터가 없을 경우 전부 조회
app.get('/driveInfos', function(req,res){
    DriveInfo.find(function(err, driveInfos){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(driveInfos);
    })
});

// GET SINGLE BOOK
app.get('/driveInfos/:driveInfo_id', function(req, res){
    DriveInfo.findOne({_id: req.params.book_id}, function(err,driveInfo){
      if(err) return res.status(500).json({error: err});
      if(!driveInfo) return res.status(404).json({error: 'driveInfo not found'});
      res.json(driveInfo);
    })
    //res.end();
});

// // GET BOOK BY AUTHOR
// app.get('/api/books/author/:author', function(req, res){
//     res.end();
// });

/*
waypoint: String,
destination: String,
start_time: String,
term: String,
personnel: String,
status: String,
drivername: String,
custno: String,
phone: String
*/

// GET BOOKS BY AUTHOR
app.get('/driveInfos/waypoint/:waypoint', function(req, res){
    DriveInfo.find({waypoint: req.params.waypoint},
      { _id: 0,
        waypoint: 1,
        destination: 1,
        start_time: 1,
        term: 1,
        personnel: 1,
        status: 1
        },  function(err, driveInfos){
        if(err) return res.status(500).json({error: err});
        if(driveInfos.length === 0) return res.status(404).json({error: 'driveInfos not found'});
        res.json(driveInfos);
    })
});

// CREATE BOOK
// app.post('/api/books', function(req, res){
//     res.end();
// });
// create Post /api/books
// driveInfos 데이터를 DB 에 저장하는 API
/*
waypoint: String,
destination: String,
start_time: String,
term: String,
personnel: String,
status: String,
drivername: String,
custno: String,
phone: String
*/
app.post('/driveInfos', function(req, res){
    var driveInfo = new DriveInfo();
    driveInfo.waypoint = req.body.waypoint;
    driveInfo.destination = req.body.destination;
    driveInfo.start_time = req.body.start_time;
    driveInfo.term = req.body.term;
    driveInfo.personnel = req.body.personnel;
    driveInfo.status = req.body.status;
    driveInfo.drivername = req.body.drivername;
    driveInfo.custno = req.body.custno;
    driveInfo.phone = req.body.phone;

    driveInfo.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }

        res.json({result: 1});

    });
});

// // UPDATE THE BOOK
// app.put('/api/books/:book_id', function(req, res){
//     res.end();
// });

// UPDATE THE BOOK
// id 에 해당하는 데이터를 찾아서(findById) 전달받은 값(req.body..)으로 변경(save)해준다.
/*
waypoint: String,
destination: String,
start_time: String,
term: String,
personnel: String,
status: String,
drivername: String,
custno: String,
phone: String
*/

app.put('/driveInfos/:driveInfo_id', function(req, res){
    DriveInfo.findById(req.params.driveInfo_id, function(err, driveInfo){
        if(err) return res.status(500).json({ error: 'database failure' });
        if(!driveInfo) return res.status(404).json({ error: 'driveInfo not found' });

        if(req.body.waypoint) driveInfo.waypoint = req.body.waypoint;
        if(req.body.destination) driveInfo.destination = req.body.destination;
        if(req.body.start_time) driveInfo.start_time = req.body.start_time;
        if(req.body.term) driveInfo.term = req.body.term;
        if(req.body.personnel) driveInfo.personnel = req.body.personnel;


        driveInfo.save(function(err){
            if(err) res.status(500).json({error: 'failed to update'});
            res.json({message: 'driveInfo updated'});
        });

    });

});

// // DELETE BOOK
// app.delete('/api/books/:book_id', function(req, res){
//     res.end();
// });

// DELETE BOOK
// book_id 에 해당하는 데이터 제거
app.delete('/driveInfos/:driveInfo_id', function(req, res){
    DriveInfo.remove({ _id: req.params.driveInfo_id }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });

        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
        if(!output.result.n) return res.status(404).json({ error: "book not found" });
        res.json({ message: "book deleted" });
        */

        res.status(204).end();
    })
});















}
