'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')
var session = require('express-session')


const URL = 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'


/* GET home page. */
router.get('/', checkSignIn, async (req, res, next) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('users')
    const usersarr = await collection.find().toArray()
    const collection2 = db.collection('groups')
    const grpsarr = await collection2.find().toArray()
    client.close()
    //console.log(usersarr)
    res.render('administration', {
        chemin: 'Settings',
        title: 'Administration',
        users: usersarr,
        groups: grpsarr,
        role: req.session.user.role,
        usermail: req.session.user.email
    });
});

router.post('/new', checkSignIn, async (req, res) => {
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

function checkSignIn(req, res, next) {
    if (req.session.user) {
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        res.redirect('/login');
        //next(err);  //Error, trying to access unauthorized page!
    }
}

module.exports = router;
