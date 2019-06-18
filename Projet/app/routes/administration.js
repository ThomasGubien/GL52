'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')
var session = require('express-session')
var sha256 = require('js-sha256')

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
    const groupe = { name: grp.nomgrp, gestionnaire: req.session.user.email, users: grp.usersgrp }
    await collection.insertOne(groupe)
    //console.log(groupe)
    client.close()
    res.redirect('/administration')
})

router.post('/accountCreation', checkSignIn, async (req, res) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('users')
    /*let grp = req.body
    //console.log(grp)
    const groupe = { name: grp.nomgrp, gestionnaire: req.session.user.email, users: grp.usersgrp }
    await collection.insertOne(groupe)
    //console.log(groupe)
    client.close()*/
    const csv = req.files.myFile.data.toString('utf8')
    const userArray=csv.split(/\r\n/g)
    const formatUsers= await formatUserList(collection,userArray)
    const accounts= _.compact(formatUsers)
    console.log(accounts)
    if(accounts!==[]){
        await collection.insertMany(accounts)
    }
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

async function formatUserList(collection,userArray){
    const formatted =  _.map(userArray, (user,key)=>{
        const [name,firstName,email]=user.split(';')
        /*const alreadyEx= collection.findOne({email:email})
        console.log(alreadyEx)
        if(!alreadyEx){*/
        return  {name:name.toUpperCase(),firstName:firstName.toUpperCase(),email,password:sha256(name.toUpperCase()),role:'etd'}
        //}
    })
    //console.log(formatted)
    return formatted
}

module.exports = router;
