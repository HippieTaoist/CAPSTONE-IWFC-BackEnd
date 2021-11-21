var express = require('express');
var router = express.Router();

const {
    cryptoProgramsGetAll
} = require('./controller/cryptosProgramsController')

/* GET cryptoProgramsGetAll */
router.get('/', cryptoProgramsGetAll);



module.exports = router;