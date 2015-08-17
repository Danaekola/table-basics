var express = require('express');
var router = express.Router();
var mysql = require('mysql');

function group(rows) {
  var result = {};
  var attr = [];
  rows.forEach(function(val) {
    result[val.sno] = result[val.sno] || {};
    result[val.sno][val.cname] = val.scores;
    result[val.sno].sname = val.sname;
    result[val.sno].sno = val.sno;
  });
  for (var i in result) {

    attr.push(result[i]);
  }

  return attr;
}


router.all('*', function(res, req, next) {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '34368467',
    database: 'mytable'
  });
  connection.connect(function(err) {
    console.log("database has linked");
    next();
  });
});

router.get('/', function(req, res) {

  connection.query("select Student.sno,Cource.cno,Student.sname,Scores.scores,Cource.cname from Student,Scores,Cource where Student.sno=Scores.sno and Cource.cno=Scores.cno",
    function(err, rows) {

      var content = group(rows);

      res.render('index', {
        content: content
      });
      connection.end();
    });
});

/* GET home page. */


router.get('/score', function(req, res, next) {
  connection.query("select Student.sno,Cource.cno,Student.sname,Scores.scores,Cource.cname from Student,Scores,Cource where Student.sno=Scores.sno and Cource.cno=Scores.cno",
    function(err, rows) {

      var content = group(rows);

      var key = req.query.key;
      var flag = req.query.flag;

      var scores = content.sort(function(a, b) {
        return (a[key] - b[key]) * flag;
      });


      res.send(scores);

      connection.end();
    });

});

router.delete('/delete', function(req, res, next) {
  var sno = req.body.sno;

  connection.query("delete  from Scores where Scores.sno =" + sno,
    function(err, rows) {
      if (err) {
        throw err;
      } else {
        res.send({
          status: 200
        });
      }
      connection.end();
    });
});
router.post('/add', function(req, res, next) {
  var info = req.body;

  connection.query("insert into Student(sname) values('" + info.name + "')",
    function(err, rows) {

      connection.query("insert into Scores(scores,sno,cno) values(" + info.English + ',' + rows.insertId + ',' + "3),(" + info.Chinese + ',' + rows.insertId + ',' + "2),(" + info.Math + ',' + rows.insertId + ',' + "1);",
        function(err, rows) {
          if (err) {
            throw err;
          } else {
            res.send({
              status: 200
            });
          }
          connection.end();
        });

    });

});


module.exports = router;
