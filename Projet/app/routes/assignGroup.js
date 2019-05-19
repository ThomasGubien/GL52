'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')

const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

var quid

router.get('/', async (req, res, next) =>{
    console.log('get/quid ' + req.query.quizId)
    var ObjectId = require('mongodb').ObjectID;
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('groups')
    const queryResult = await collection.find().toArray()
    const availableResultSet = queryResult.map((availGroup, _id) => {
        return availGroup
    })

    console.log(availableResultSet)

    quid = req.query.quizId;
    const affectedCollection = db.collection('questionnaires')

    //Select id_group from questionnaire
    //Where id_questionnaire = id;
    const affectedqueryResult = await affectedCollection.find({_id: ObjectId(quid)}).limit(1).project({_id:0, author:0, questions: 0, title: 0}).toArray()
    const affectedResultSet = affectedqueryResult[0]
    console.log(affectedResultSet)
    client.close()

    res.render('assignGroup', {
        title: 'Gestion des Groupes',
        affectedGroups: affectedqueryResult,
        availableGroups: availableResultSet
    })
})

router.post('/linkGroup', async (req, res) => {
    console.log('linkGroup/groupID ' + req.query.groupId)
    console.log('linkGroup/quid ' + quid)
    if(req.query.groupId !== null){
        var ObjectId = require('mongodb').ObjectID;
        const client = await MongoClient.connect(
            URL,
            { useNewUrlParser: true }
        )
        const db = client.db('gl52')        
        const collection = db.collection('groups')

        const groupDocument = await collection.findOne({_id: ObjectId(req.query.groupId)})
        
        console.log(groupDocument)

        const qcmCollection = db.collection('questionnaires')
        
        qcmCollection.updateOne({_id: ObjectId(quid)}, {$push:{groups: groupDocument}})

        const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        console.log(debugQcmDocument)
        res.redirect('/assignGroup?quizId='+quid)
    }
})

router.post('/delinkGroup', async (req, res) => {
    console.log('delinkGroup/groupID ' + req.query.groupId)
    console.log('delinkGroup/quid ' + quid)
    if(req.query.groupId !== null){
        var ObjectId = require('mongodb').ObjectID;
        const client = await MongoClient.connect(
            URL,
            { useNewUrlParser: true }
        )
        const db = client.db('gl52')        
        const collection = db.collection('groups')

        const groupDocument = await collection.find({_id: ObjectId(req.query.groupId)}).toArray()
        
        console.log(groupDocument)

        const qcmCollection = db.collection('questionnaires')
        
        qcmCollection.updateOne({_id: ObjectId(quid)}, {$pull:{groups: groupDocument}})

        const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        console.log(debugQcmDocument)
        res.redirect('/assignGroup?quizId='+quid)
    }
})

module.exports = router;
