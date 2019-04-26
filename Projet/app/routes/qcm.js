'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')

const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

router.get('/',  (req, res, next) =>{
    res.render('createQCM', {
        title: 'createQCM'
    })
})

router.post('/new', async (req, res)=>{
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
      )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const qcm=req.body
    const questions=qcm.question.map((value,index)=>{
        return {question:value,answers:qcm[`answer${index}`]}
    })
    const questionnaire={author:'Pierre',uv:'gl52',questions:questions}
    await collection.insertOne(questionnaire)
    client.close()
})
module.exports = router