'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')


const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'


router.get('/upload',  (req, res, next) =>{
    res.render('uploadFile', {
        title: 'Upload a file'
    })
})

router.get('/upload', (req, res, next) => {
    res.render('downloadFile', {
        title: 'Upload a file'
    })
})

router.post('/new',async (req, res, next) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const sampleFile = req.files.myFile;
  console.log(sampleFile)
  const client = await MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
  const db = client.db('gl52')
  const collection = db.collection('files')
  const theFile={name:sampleFile.name,data:sampleFile.data,author:'5ca622b50a14fe182147ffdd'}
  await collection.insertOne(theFile)
  client.close()
  res.redirect('/#')
})
module.exports = router