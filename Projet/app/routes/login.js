var express = require('express');
var router = express.Router();
var URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'
var mysql = require('mysql');
const MongoClient = require('mongodb')


router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/log',async function (req, res) {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
      )
    const db = client.db('gl52')
    const collection = db.collection('users')
    var infos = req.body;
    const user= await collection.findOne({email:infos.email})
    client.close()
    console.log(user)
    console.log(user.password)
    console.log(infos.pwd)
    if(user.password==infos.pwd){
        res.redirect('/')
    }
    else{
        res.send({
            'code':204,
            'success':'Wrong Credentials'
        })
    }
    /*
    connection.query('Select * from users where UserMail = ?', infos.email, function (err, rows) {
        console.log(rows[0].UserPassword);
        //var password = rows[0].UserPassword;
        console.log(infos);
        if (rows[0].UserPassword == infos.pwd) {
            connection.end();
            res.redirect('/');
        }
    });
*/
});

module.exports = router;