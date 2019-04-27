var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/',  function (req, res, next) {
    res.render('index', {
        title: 'Dashboard'
    });
});

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

module.exports = router;
