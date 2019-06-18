'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')
const fs = require('fs')
var session = require('express-session')


const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'


router.get('/upload', checkSignIn, async (req, res, next) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection2 = db.collection('groups')
    const arr2 = await collection2.find().toArray()
    const grpsarr = arr2.map((qcm, index) => {
        return qcm
    })
    client.close()
    res.render('uploadFile', {
        chemin: 'Files',
        title: 'Upload a file',
        groups: grpsarr,
        role: req.session.user.role
    })
})

router.get('/download', checkSignIn, async (req, res, next) => {
    var usermail = req.session.user.email
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('files')
    const userinfo = await collection.findOne({ email: usermail })
    const collection2 = db.collection('groups')
    const userGrps = await collection2.find({ users: usermail }).toArray()
    const UserGrpsNames = userGrps.map((grp, index) => {
        return grp.name
    })
    const arr = await collection.find({ groups: { $in: UserGrpsNames } }).toArray()
    const filesarr = arr.map((qcm, index) => {
        return qcm
    })
    client.close()
    console.log(filesarr)
    res.render('downloadFile', {
        chemin: 'Files',
        title: 'Download',
        files: filesarr,
        role: req.session.user.role
    })
})

router.post('/new', checkSignIn, async (req, res, next) => {
    var usermail = req.session.user.email
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const sampleFile = req.files.myFile
  // TEST
  //const filecontent=fs.readFileSync(sampleFile.data)
  //console.log(sampleFile.data.toString('utf8'))
  // TEST END
  const client = await MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
  const db = client.db('gl52')
  const collection = db.collection('files')
    const theFile = { name: req.body.title, filename: sampleFile.name, data: sampleFile.data, author: usermail, groups:[req.body.grp]}
  await collection.insertOne(theFile)
  client.close()
    res.redirect('/file/download')
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

module.exports = router