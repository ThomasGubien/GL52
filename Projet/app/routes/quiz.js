'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')

const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

router.get('/create', async  (req, res, next) =>{
    console.log('QCMID ' + req.query.qcmID)
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
    res.render('createQuiz', {
        chemin: 'Quiz',
        title: 'Create',
        groups: grpsarr
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
    console.log(fullarr)
    res.render('manageQuiz', {
        chemin: 'Quiz',
        title: 'Manage',
        quiz: fullarr
    })
})


router.get('/manage/:quiz_id', async (req, res, next) => {
    var ObjectId = require('mongodb').ObjectID;
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const qcmCollection = db.collection('questionnaires')
    const grpCollection = db.collection('groups')

    var qcm = await qcmCollection.findOne({ _id: ObjectId(req.params.quiz_id) })
    const allGroups = await grpCollection.find().toArray()
    var affGroupArray = new Array()
    var availableGroupsArray = new Array()
    var groupsID = new Array()
    if (typeof qcm.groups !== 'undefined' && qcm.groups.length > 0) {
        qcm.groups.forEach(element => {
            groupsID.push(ObjectId(element._id))
        });

        qcm.groups.forEach(element => {
            allGroups.forEach(grp => {
                if (element.id.toString() == grp._id.toString()) {
                    grp.rights = element.rights
                    affGroupArray.push(grp)
                }
            });
        });
    }

    allGroups.forEach(grp => {
        if (!affGroupArray.includes(grp)) {
            availableGroupsArray.push(grp)
        }
    });

    console.log(qcm)
    console.log(affGroupArray)
    console.log(availableGroupsArray)

    client.close()

    res.render('assignGroup', {
        title: 'Gestion des Groupes',
        quiz: qcm,
        affectedGroup: affGroupArray,
        availableGroups: availableGroupsArray
    })
})

router.post('/manage/linkGroup/:quiz_id/:group_id', async (req, res) => {
    if (req.params.group_id !== null) {
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
        if (infos.read) {
            read = true
        }
        if (infos.write) {
            write = true
        }

        const qcmCollection = db.collection('questionnaires')

        qcmCollection.updateOne({ _id: ObjectId(req.params.quiz_id) }, { $push: { groups: { id: ObjectId(req.params.group_id), rights: { read: read, write: write } } } })

        //Debug
        //const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        //console.log(debugQcmDocument)
        res.redirect('/quiz/manage/' + req.params.quiz_id)
    }
})


router.post('/manage/delinkGroup/:quiz_id/:group_id', async (req, res) => {
    if (req.params.quiz_id !== null) {
        var ObjectId = require('mongodb').ObjectID;
        const client = await MongoClient.connect(
            URL,
            { useNewUrlParser: true }
        )
        const db = client.db('gl52')
        const collection = db.collection('questionnaires')
        const qcmDocument = await collection.findOne({ _id: ObjectId(req.params.quiz_id) })

        var selectedGroup
        qcmDocument.groups.forEach(group => {
            if (req.params.group_id.toString() == group.id.toString()) {
                selectedGroup = group
            }
        });

        //console.log(selectedGroup)

        const qcmCollection = db.collection('questionnaires')

        qcmCollection.updateOne({ _id: ObjectId(req.params.quiz_id) }, { $pull: { groups: selectedGroup } })

        //Debug
        //const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        //console.log(debugQcmDocument)
        res.redirect('/quiz/manage/' + req.params.quiz_id)
    }
})


router.post('/manage/modifyRightsGroup/:quiz_id/:group_id', async (req, res) => {
    if (req.params.quiz_id !== null) {
        var ObjectId = require('mongodb').ObjectID;
        const client = await MongoClient.connect(
            URL,
            { useNewUrlParser: true }
        )
        const db = client.db('gl52')
        const qcmCollection = db.collection('questionnaires')
        const qcmDocument = await qcmCollection.findOne({ _id: ObjectId(req.params.quiz_id) })

        //Set group's rights
        var infos = req.body
        var read = false
        var write = false
        if (infos.read) {
            read = true
        }
        if (infos.write) {
            write = true
        }

        qcmCollection.updateOne({ _id: ObjectId(req.params.quiz_id), "groups.id": ObjectId(req.params.group_id) }, { $set: { "groups.$.rights.read": read, "groups.$.rights.write": write } })

        //Debug
        //const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        //console.log(debugQcmDocument)
        res.redirect('/quiz/manage/' + req.params.quiz_id)
    }
})

router.get('/answer', async (req, res, next) => {
    console.log('QCMID ' + req.query.qcmID)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const arr = await collection.find().toArray()
    const quizarr = arr.map((qcm, index) => {
        return qcm
    })
    client.close()
    console.log(quizarr)
    res.render('answerQuiz', {
        chemin: 'Quiz',
        title: 'Answer',
        quiz: quizarr
    })
})

router.get('/startQuiz/:quiz_id', async (req, res, next) => {
    console.log('QCMID ' + req.params.quiz_id)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const q = await collection.findOne({ title: req.params.quiz_id })
    let minu = q.duration
    let secd = Math.floor(q.duration / 60)
    client.close()
    console.log(q)
    res.render('quiz', {
        chemin: 'Quiz',
        title: 'Answer',
        quiz: q,
        minutes: minu,
        seconds: secd,
        questions: q.questions
    })
})

router.post('/newAnswers/:quiz_id', async (req, res) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('answers')
    const result = _.map(req.body, (value, key) => {
        return { question: key, answers: value }
    })
    const answers = { author: '5ca622b50a14fe182147ffdd', title: req.params.quiz_id, answers: result }
    await collection.insertOne(answers)
    client.close()
    console.log(req.body)
    res.redirect('/quiz/answer')
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
    console.log(qcm)
    let sumQuestTime
    let questTime
    const questions = qcm.question.map((value, index) => {
        if (qcm[`illTimeQuiz${index}`]) {
            questTime = 0
        } else {
            questTime = (qcm[`durQu7y7y0iz${index}`])
        }

        return { question: value, answers: (qcm[`answer${index}`] || null), correctAnswer: (qcm[`check${index}`] || null), duration: questTime }
    })

    //Set duration
    let time
    if (qcm.infiniteTime) {
        time = 0
    } else {
        time = qcm.dureeqcm
    }
    const questionnaire = { author: '5ca622b50a14fe182147ffdd', groups: [qcm.usersgrp], questions: questions, title: qcm.nomqcm}
    await collection.insertOne(questionnaire)
    client.close()
    res.redirect('/quiz/manage')
})

router.get('/result/:quiz_id', async (req, res, next) => {
    console.log('QCMID ' + req.params.quiz_id)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const q = await collection.findOne({ title: req.params.quiz_id })
    const collection2 = db.collection('answers')
    const userAnswers = await collection2.findOne({ title: req.params.quiz_id })
    client.close()
    console.log(q)
    console.log(userAnswers)
    res.render('result', {
        chemin: 'Quiz',
        title: 'Answer',
        answers: userAnswers.answers,
        quiz: q,
        questions: q.questions
    })
})

router.get('/list', async (req, res, next) => {
    console.log('QCMID ' + req.query.qcmID)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const arr = await collection.find().toArray()
    const quizarr = arr.map((qcm, index) => {
        return qcm
    })
    client.close()
    console.log(quizarr)
    res.render('viewResults', {
        chemin: 'Quiz',
        title: 'Answer',
        quiz: quizarr
    })
})

module.exports = router