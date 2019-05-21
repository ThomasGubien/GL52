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

    quid = req.query.quizId;

    const qcmCollection = db.collection('questionnaires')

    const qcm = await qcmCollection.findOne({_id: ObjectId(quid)})

    console.log(qcm)
    var groupsID = new Array()
    qcm.groups.forEach(element => {
        groupsID.push(ObjectId(element._id))    
    });
    console.log(groupsID)
    var affGroupArray = qcm.groups

    //Get available groups
    const collection = db.collection('groups')
    const availableGroups = await collection.find({_id: {"$nin": groupsID}}).toArray()
    const availableResultSet = availableGroups.map((availGroup, _id) => {
        return availGroup
    })

    console.log(availableResultSet)
    
    client.close()

    res.render('assignGroup', {
        title: 'Gestion des Groupes',
        quiz: qcm,
        affectedGroup: affGroupArray,
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

        //Set group's rigths
        var infos = req.body
        read = false
        write = false
        if(infos.read){
            read = true
        }
        if(infos.write){
            write = true
        }

        const qcmCollection = db.collection('questionnaires')
        
        qcmCollection.updateOne({_id: ObjectId(quid)}, {$push:{groups: {id: ObjectId(req.query.groupId), rigths: {read: read, write: write }}}})

        //Debug
        //const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        //console.log(debugQcmDocument)
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
        const collection = db.collection('questionnaires')
        const qcmDocument = await collection.findOne({_id: ObjectId(quid)})

        /*
        //Set group's rigths
        var infos = req.body
        read = false
        write = false
        if(infos.read){
            read = true
        }
        if(infos.write){
            write = true
        }
        */
        var selectedGroup
        qcmDocument.groups.forEach(group => {
            if (ObjectId(req.query.groupId) = group.id)
            {  
              selectedGroup = group
            }  
        });
        
        console.log(selectedGroup)

        const qcmCollection = db.collection('questionnaires')
        
        qcmCollection.updateOne({_id: ObjectId(quid)}, {$pull:{groups: selectedGroup}})

        //Debug
        //const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        //console.log(debugQcmDocument)
        res.redirect('/assignGroup?quizId='+quid)
    }
})

module.exports = router;
