'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')


const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'


router.get('/upload', async (req, res, next) => {
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
        groups: grpsarr
    })
})

router.get('/download', async (req, res, next) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('files')
    const arr = await collection.find().toArray()
    const filesarr = arr.map((qcm, index) => {
        return qcm
    })
    client.close()
    console.log(filesarr)
    res.render('downloadFile', {
        chemin: 'Files',
        title: 'Download',
        files: filesarr
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
    const theFile = { name: req.body.title,filename:sampleFile.name,data:sampleFile.data,author:'5ca622b50a14fe182147ffdd', groups:[req.body.grp]}
  await collection.insertOne(theFile)
  client.close()
    res.redirect('/file/download')
})
module.exports = router