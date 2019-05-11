'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')


const URL = 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'


/* GET users listing. */
router.get('/', async (req, res, next) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('users')
    const userinfo = await collection.findOne({name:'GUBIEN'})
    const collection2 = db.collection('groups')
    const arr2 = await collection2.find({users: 'GUBIEN'}).toArray()
    const grpsarr = arr2.map((qcm, index) => {
        return qcm
    })
    client.close()
    //console.log(grpsarr)
    res.render('userProfile', {
        chemin: 'Settings',
        title: 'Profil',
        profil: userinfo,
        groups: grpsarr
    });
});

module.exports = router;
