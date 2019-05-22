'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')

const URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

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
    const grpCollection = db.collection('groups')

    var qcm = await qcmCollection.findOne({_id: ObjectId(quid)})
    const allGroups = await grpCollection.find().toArray()   
    var affGroupArray = new Array()
    var availableGroupsArray = new Array()
    console.log(qcm)
    var groupsID = new Array()
    if(typeof qcm.groups !== 'undefined' && qcm.groups.length > 0)
    {
        qcm.groups.forEach(element => {
            groupsID.push(ObjectId(element._id)) 
        });
        console.log(groupsID) 
        console.log(allGroups)

        qcm.groups.forEach(element => {
            allGroups.forEach(grp => {
                if(element.id.toString() == grp._id.toString())
                {
                    grp.rights = element.rights
                    affGroupArray.push(grp)
                }
            });
        });
    }

    allGroups.forEach(grp => {
        if (!affGroupArray.includes(grp))
        {
            availableGroupsArray.push(grp)
        }
    });

    console.log(availableGroupsArray)
    
    client.close()

    res.render('assignGroup', {
        title: 'Gestion des Groupes',
        quiz: qcm,
        affectedGroup: affGroupArray,
        availableGroups: availableGroupsArray
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

        //Set group's rights
        var infos = req.body
        var read = false
        var write = false
        if(infos.read){
            read = true
        }
        if(infos.write){
            write = true
        }

        const qcmCollection = db.collection('questionnaires')
        
        qcmCollection.updateOne({_id: ObjectId(quid)}, {$push:{groups: {id: ObjectId(req.query.groupId), rights: {read: read, write: write }}}})

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

        var selectedGroup
        qcmDocument.groups.forEach(group => {
            if (req.query.groupId.toString() == group.id.toString())
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


router.post('/modifyRightsGroup', async (req, res) => {
    console.log('delinkGroup/groupID ' + req.query.groupId)
    console.log('delinkGroup/quid ' + quid)
    if(req.query.groupId !== null){
        var ObjectId = require('mongodb').ObjectID;
        const client = await MongoClient.connect(
            URL,
            { useNewUrlParser: true }
        )
        const db = client.db('gl52')        
        const qcmCollection = db.collection('questionnaires')
        const qcmDocument = await qcmCollection.findOne({_id: ObjectId(quid)})

        
        console.log(infos.read)
        console.log(infos.write)
        //Set group's rights
        var infos = req.body
        var read = false
        var write = false
        if(infos.read){
            read = true
        }
        if(infos.write){
            write = true
        }
        
        var selectedGroup
        qcmDocument.groups.forEach(group => {
            if (ObjectId(req.query.groupId) == group.id)
            {  
              selectedGroup = group
            }  
        });
        
        console.log(selectedGroup)
        
        qcmCollection.updateOne({_id: ObjectId(quid)}, {$push:{groups: {id: ObjectId(req.query.groupId), rights: {read: read, write: write }}}})

        //Debug
        //const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        //console.log(debugQcmDocument)
        res.redirect('/assignGroup?quizId='+quid)
    }
})

module.exports = router;
