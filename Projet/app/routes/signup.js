'use strict'
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb')
const _ = require('lodash')
var sha256 = require('js-sha256')


const  URL= 'mongodb://devgl52:kkgfFbXM6XR0d2tk@database-shard-00-00-kldkd.mongodb.net:27017,database-shard-00-01-kldkd.mongodb.net:27017,database-shard-00-02-kldkd.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true'
router.get('/', (req, res, next) =>{
    res.render('signup')
  })

router.post('/new',async function (req, res) {
    const client = await MongoClient.connect(
        URL,
        { useNewUrlParser: true }
      )
    const db = client.db('gl52')
    const collection = db.collection('users')
    const infos = req.body;
    let check=true
    console.log(infos.pwd)
    console.log(infos.confPwd)
    if(infos.pwd!==infos.confPwd){
        console.error('Not same passwords')
        check=false
        
    }
    if(infos.email.match('.*@utbm.fr')==null){
         console.error('Please use your UTBM email')
        check=false
        
    }
    _.map(infos, (value,index)=>{
        if(value==''){
            console.error('Fill all fields please')
            check=false
            
        }
    })
   if(check){
        const user= await collection.findOne({email:infos.email})
        if(user!==null){
            console.error('This Email is already used')
            res.send({
                'code':204,
                'success':'Wrong Registration'
            })
        }
        else {
            let hash = sha256(infos.pwd)
            const newUser = { name: infos.name.toUpperCase(), firstName: infos.firstName.toUpperCase(), email: infos.email, password: hash}
            await collection.insertOne(newUser)
            console.log('You are now registred, you can login')
            res.redirect('/login')
        }
    }
    else{
        res.send({
            'code':204,
            'success':'Wrong Registration'
        })
    }
})

  
  module.exports = router