'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')

const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

router.get('/create',  (req, res, next) =>{
    console.log('QCMID '+req.query.qcmID)
    res.render('createQuiz', {
        chemin: 'Quiz',
        title: 'Create'
    })
})

router.get('/manage', async (req, res, next) => {
    console.log('QCMID ' + req.query.qcmID)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const arr = await collection.find().toArray()
    const fullarr = arr.map((qcm, index) => {
        return qcm
    })
    client.close()
    //console.log(fullarr)
    res.render('manageQuiz', {
        chemin: 'Quiz',
        title: 'Manage',
        quiz: fullarr
    })
})

router.get('/answer', (req, res, next) => {
    console.log('QCMID ' + req.query.qcmID)
    res.render('answerQuiz', {
        chemin: 'Quiz',
        title: 'Answer'
    })
})

router.post('/new', async (req, res)=>{
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
      )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    let qcm=req.body
    if(typeof(qcm.question)==='string'){
        qcm.question=[qcm.question]
    }
    const questions=qcm.question.map((value,index)=>{
        return {question:value,answers:(qcm[`answer${index}`]||null),correctAnswer:(qcm[`check${index}`]||null)}
    })
    const questionnaire={author:'5ca622b50a14fe182147ffdd',uv:'gl52',questions:questions,title:'test'}
    await collection.insertOne(questionnaire)
    client.close()
})

module.exports = router