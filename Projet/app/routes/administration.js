var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('administration', {
        chemin: 'Settings',
        title: 'Administration'
    });
});


module.exports = router;
