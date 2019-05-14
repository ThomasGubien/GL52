'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')

const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

router.get('/', async (req, res, next) =>{
    console.log('QCMID ' + req.query.qcmID)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('groups')
    const queryResult = await collection.find().toArray()
    const availableResultSet = queryResult.map((availGroup, index) => {
        return availGroup
    })
    console.log(availableResultSet)

    var quid = req.query.quizId;
    const affCollection = db.collection('questionnaires')
    //Select id_group from questionnaire
    //Where id_questionnaire = id;
const affqueryResult = await affCollection.find({index: 1/*id*/}, {index:0, groups:1}).toArray()
    const affectedResultSet = affqueryResult.map((affGroup, index) => {
        return affGroup
    })
    console.log(affectedResultSet)
    client.close()

    res.render('assignGroup', {
        title: 'Gestion des Groupes',
        affectedGroups: affectedResultSet,
        availableGroups: availableResultSet
    })
})

module.exports = router;
