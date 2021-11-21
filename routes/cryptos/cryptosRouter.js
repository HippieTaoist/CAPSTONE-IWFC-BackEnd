var express = require('express');
var router = express.Router();

const {
    middlewareJwt
} = require('../users/lib/middlewareJwt/middlewareJwt')

const {
    cryptosGet
} = require('./controller/cryptoController')

/* GET Cryptos Saved By Users */
router.get('/', middlewareJwt, cryptosGet)



// function (req, res, next) {
//     res.json({
//         message: "hey i'm a cryptosRouter"
//     });


module.exports = router