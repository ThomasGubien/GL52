var express = require('express');
var router = express.Router();
var URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'
var mysql = require('mysql');
const MongoClient = require('mongodb')
var sha256 = require('js-sha256')

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
    let hash = sha256(infos.pwd)
    console.log(hash)
    if (user.password == hash) {
        req.session.user = user
        res.redirect('/')
    }
    else{
        res.send({
            'code':204,
            'success':'Wrong Credentials'
        })
    }
});

module.exports = router;