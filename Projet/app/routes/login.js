var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'moodle2'
});

router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/log', function (req, res) {

    var infos = req.body;
    connection.connect();
    connection.query('Select * from users where UserMail = ?', infos.email, function (err, rows) {
        console.log(rows[0].UserPassword);
        //var password = rows[0].UserPassword;
        console.log(infos);
        if (rows[0].UserPassword == infos.pwd) {
            connection.end();
            res.redirect('/');
        }
    });

});

module.exports = router;