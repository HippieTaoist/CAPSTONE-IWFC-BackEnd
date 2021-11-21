var express = require('express');
var router = express.Router();

const {
    middlewareJwt
} = require('../users/lib/middlewareJwt/middlewareJwt')

const {
    cryptosGet,
    cryptoCreate,
    cryptoUpdate
} = require('./controller/cryptoController')

/* GET Cryptos Saved By Users */
router.get('/', middlewareJwt, cryptosGet)

router.post('/crypto-create', middlewareJwt, cryptoCreate)

router.put('/crypto-update', middlewareJwt, cryptoUpdate)

// function (req, res, next) {
//     res.json({
//         message: "hey i'm a cryptosRouter"
//     });


module.exports = router