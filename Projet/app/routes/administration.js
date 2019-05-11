'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')


const URL = 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'


/* GET home page. */
router.get('/', async (req, res, next) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('users')
    const arr = await collection.find().toArray()
    const usersarr = arr.map((qcm, index) => {
        return qcm
    })
    const collection2 = db.collection('groups')
    const arr2 = await collection2.find().toArray()
    const grpsarr = arr2.map((qcm, index) => {
        return qcm
    })
    client.close()
    //console.log(usersarr)
    res.render('administration', {
        chemin: 'Settings',
        title: 'Administration',
        users: usersarr,
        groups: grpsarr
    });
});

router.post('/new', async (req, res) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('groups')
    let grp = req.body
    //console.log(grp)
    const groupe = { name: grp.nomgrp, gestionnaire: grp.gestionnairegrp, users: grp.usersgrp }
    await collection.insertOne(groupe)
    //console.log(groupe)
    client.close()
    res.redirect('/administration')
})

module.exports = router;
