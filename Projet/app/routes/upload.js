'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')
const fs = require('fs')

const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

const multer=require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })


router.get('/',  (req, res, next) =>{
    res.render('file', {
        title: 'Upload a file'
    })
})

router.post('/new', upload.single('myFile'), (req, res, next) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
 
    var finalImg = {
      contentType: req.file.mimetype,
      image:  new Buffer(encode_image, 'base64')
    }
    console.log(finalImg)
    // const client = await MongoClient.connect(
    //     URL,
    //     { useNewUrlParser: true }
    //   )
    // const db = client.db('gl52')
    // const collection = db.collection('files')
    
    // if(typeof(qcm.question)==='string'){
    //     qcm.question=[qcm.question]
    // }
    // const questions=qcm.question.map((value,index)=>{
    //     return {question:value,answers:(qcm[`answer${index}`]||null),correctAnswer:(qcm[`check${index}`]||null)}
    // })
    // const questionnaire={author:'5ca622b50a14fe182147ffdd',uv:'gl52',questions:questions,title:'test'}
    // await collection.insertOne(questionnaire)
    //client.close()
})
module.exports = router