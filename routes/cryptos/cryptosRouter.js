var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({
        message: "hey i'm a cryptosRouter"
    });
});



module.exports = router;