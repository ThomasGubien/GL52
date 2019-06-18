'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')
const session = require('express-session')
const ObjectId = require('mongodb').ObjectID

const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

router.get('/create', checkSignIn, async  (req, res, next) =>{
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
        groups: grpsarr,
        role: req.session.user.role
    })
})

router.get('/manage', checkSignIn, async (req, res, next) => {
    const usermail = req.session.user.email
    console.log('QCMID ' + req.query.qcmID)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const arr = await collection.find({author:usermail}).toArray()
    /*const fullarr = arr.map((qcm, index) => {
        return qcm
    })*/
    client.close()
    console.log(arr)
    res.render('manageQuiz', {
        chemin: 'Quiz',
        title: 'Manage',
        quiz: arr,
        role: req.session.user.role
    })
})

router.get('/manage/:quiz_id', checkSignIn, async (req, res, next) => {
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
    var gro = new Array()
    if (typeof qcm.groups !== 'undefined' && qcm.groups.length > 0) {
        qcm.groups.forEach(element => {
            gro.push(element)
        });

        qcm.groups.forEach(element => {
            allGroups.forEach(grp => {
                if (element.name == grp.name) {
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
        availableGroups: availableGroupsArray,
        role: req.session.user.role
    })
})

router.post('/manage/linkGroup/:quiz_id/:group_name', checkSignIn, async (req, res) => {
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

        qcmCollection.updateOne({ _id: ObjectId(req.params.quiz_id) }, { $push: { groups: { name: req.params.group_name, rights: { read: read, write: write } } } })

        //Debug
        //const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        //console.log(debugQcmDocument)
        res.redirect('/quiz/manage/' + req.params.quiz_id)
    }
})


router.post('/manage/delinkGroup/:quiz_id/:group_name', checkSignIn, async (req, res) => {
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
            if (req.params.group_name == group.name) {
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


router.post('/manage/modifyRightsGroup/:quiz_id/:group_name', checkSignIn, async (req, res) => {
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

        qcmCollection.updateOne({ _id: ObjectId(req.params.quiz_id), "groups.name": req.params.group_name }, { $set: { "groups.$.rights.read": read, "groups.$.rights.write": write } })

        //Debug
        //const debugQcmDocument = await qcmCollection.find({_id: ObjectId(quid)}).toArray()
        //console.log(debugQcmDocument)
        res.redirect('/quiz/manage/' + req.params.quiz_id)
    }
})

router.get('/answer', checkSignIn, async (req, res, next) => {
    var usermail = req.session.user.email
    console.log('QCMID ' + req.query.qcmID)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const userinfo = await collection.findOne({ email: usermail })
    const collection2 = db.collection('groups')
    const userGrps = await collection2.find({ users: usermail }).toArray()
    const UserGrpsNames = userGrps.map((grp, index) => {
        return grp.name
    })
    //console.log(UserGrpsNames)
    const collection3 = db.collection('answers')
    const UserAnswer = await collection3.find({ author: usermail }).toArray()
    const UserAnswersQuiz = UserAnswer.map((ans, index) => {
        return ans.title
    })
    //console.log(UserAnswersQuiz)
    const arr = await collection.find({ 'groups.name': { $in: UserGrpsNames } }).toArray()
    const quizarr = arr.map((qcm, index) => {
        return qcm
    })
    //console.log(quizarr)
    client.close()
    res.render('answerQuiz', {
        chemin: 'Quiz',
        title: 'Answer',
        quiz: quizarr,
        quizanswered: UserAnswersQuiz,
        role: req.session.user.role
    })
})

router.get('/startQuiz/:quiz_id', checkSignIn, async (req, res, next) => {
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
        questions: q.questions,
        role: req.session.user.role
    })
})

router.post('/newAnswers/:quiz_id', checkSignIn, async (req, res) => {
    var usermail = req.session.user.email
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('answers')
    const collection2 = db.collection('questionnaires')
    console.log(req.params.quiz_id)
    const questionnaire= await collection2.findOne({title:req.params.quiz_id}) 
    console.log(questionnaire)
    let note=0
    questionnaire.questions.forEach((value,index)=>{
        const question=value.question
        if(_.isEqual(req.body[question],value.correctAnswer)) note++
    })
    const result = _.map(req.body, (value, key) => {
        return { question: key, answers: value }
    })
    const answers = { author: usermail, title: req.params.quiz_id, answers: result,note }
    await collection.insertOne(answers)
    client.close()
    console.log(req.body)
    res.redirect('/quiz/answer')
})

router.post('/new', checkSignIn, async (req, res) => {
    var usermail = req.session.user.email
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
    if (typeof (qcm.usersgrp) === 'string') {
        qcm.usersgrp = [qcm.usersgrp]
    }
    //if (qcm.usersgrp.length > 1) {
    const grps = qcm.usersgrp.map((value, index) => {
        return { name: value, rights: { read: true, write: false } }
    })
    //}
    //else {
        //const grps = { name: qcm.usersgrp, rights: { read: true, write: false } }
    //}
    let qcmname = qcm.nomqcm
    const quizzz = await collection.find().toArray()
    let numbers = 0
    const exists = quizzz.map((value, index) => {
        if (value.title.includes(qcmname, 0)) {
            numbers ++
            return value
        }
    })
    console.log(exists)
    console.log(numbers)
    if (exists.length != 0) {
        qcmname = qcmname + "#" + numbers
    }
    const questionnaire = { author: usermail, groups: grps, questions: questions, title: qcmname, duration: time }
    await collection.insertOne(questionnaire)
    client.close()
    res.redirect('/quiz/manage')
})

router.get('/result/:quiz_id', checkSignIn, async (req, res, next) => {
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
        questions: q.questions,
        role: req.session.user.role
    })
})

router.get('/list', checkSignIn, async (req, res, next) => {
    var usermail = req.session.user.email
    console.log('QCMID ' + req.query.qcmID)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('questionnaires')
    const userinfo = await collection.findOne({ email: usermail })
    const collection2 = db.collection('groups')
    const userGrps = await collection2.find({ users: usermail }).toArray()
    const UserGrpsNames = userGrps.map((grp, index) => {
        return grp.name
    })
    const collection3 = db.collection('answers')
    const UserAnswer = await collection3.find({ author: usermail }).toArray()
    const UserAnswersQuiz = UserAnswer.map((ans, index) => {
        return ans.title
    })
    console.log(UserAnswersQuiz)
    const arr = await collection.find({ title: { $in: UserAnswersQuiz } }).toArray()
    const quizarr = arr.map((qcm, index) => {
        return qcm
    })
    client.close()
    console.log(quizarr)
    res.render('viewResults', {
        chemin: 'Quiz',
        title: 'Results',
        quiz: quizarr,
        role: req.session.user.role
    })
})


router.get('/listStudents', checkSignIn, async (req, res, next) => {
    var usermail = req.session.user.email
    console.log('QCMID ' + req.query.qcmID)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    /*const collection2 = db.collection('groups')
    const userGrps = await collection2.find({ gestionnaire: usermail }).toArray()
    const UserGrpsNames = userGrps.map((grp, index) => {
        return grp.name
    })*/
    const collection = db.collection('questionnaires')
    const arr = await collection.find({ author: usermail}).toArray()
    const quizarrtitle = arr.map((qcm, index) => {
        return qcm.title
    })
    const collection3 = db.collection('answers')
    const UserAnswer = await collection3.find({ title: { $in: quizarrtitle }}).toArray()
    /*const UserAnswersQuiz = UserAnswer.map((ans, index) => {
        return ans.title
    })*/
    //console.log(UserAnswersQuiz)
    client.close()
    //console.log(quizarr)
    res.render('viewStudentsResults', {
        chemin: 'Quiz',
        title: 'Results',
        quiz: UserAnswer,
        role: req.session.user.role
    })
})

router.get('/delete/:quiz_id', checkSignIn, async (req, res, next) => {
    console.log(req.params.quiz_id)
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )	
    const db = client.db('gl52')
    const collection2 = db.collection('questionnaires')
    collection2.deleteOne({_id: ObjectId(req.params.quiz_id) })
    res.render('closeitself', {
        chemin: 'Quiz',
        title: 'NTM',
    })
})

function checkSignIn(req, res, next) {
    if (req.session.user) {
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        res.redirect('/login');
        //next(err);  //Error, trying to access unauthorized page!
    }
}

module.exports = router