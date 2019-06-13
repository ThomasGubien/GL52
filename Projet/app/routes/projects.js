'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')

const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'

router.get('/getList', async (req, res, next) => {
	console.log('QCMID ' + req.query.qcmID)
	const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
	const db = client.db('gl52')
	const collection = db.collection('projects')
	const arr = await collection.find().toArray()
	const fullarr = arr.map((pr, index) => {
		return pr
	})
	client.close()
	console.log(fullarr)
    res.render('projectsList', {
		chemin: 'Projects',
		title: 'List',
		projects: fullarr
	})
})

router.get('/create', async (req, res, next) => {
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
    res.render('createProject', {
        chemin: 'Projects',
        title: 'Create',
        groups: grpsarr
    })
})

router.post('/new', async (req, res) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('projects')
    let prj = req.body
    const project = { author: '5ca622b50a14fe182147ffdd', groups: [prj.usersgrp], title: prj.nomprj, description: prj.descprj }
    await collection.insertOne(project)
    client.close()
    res.redirect('/projects/getList')
})

router.get('/getProject/:prj_id', async (req, res, next) => {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
    )
    const db = client.db('gl52')
    const collection = db.collection('projects')
    const p = await collection.findOne({ title: req.params.prj_id })
    const collection2 = db.collection('files')
    const arr = await collection2.find().toArray()
    const filesarr = arr.map((qcm, index) => {
        return qcm
    })
    client.close()
    console.log(p)
    res.render('project', {
        chemin: 'Projects',
        title: 'View',
        project: p,
        files: filesarr
    })
})

module.exports = router