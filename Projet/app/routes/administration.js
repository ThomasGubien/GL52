var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('administration', {
        title: 'Administration',
        chemin: 'Settings'
    });
});


module.exports = router;
