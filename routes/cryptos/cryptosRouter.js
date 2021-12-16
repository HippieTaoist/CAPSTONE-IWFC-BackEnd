var express = require("express");
var router = express.Router();

const { middlewareJwt } = require("../users/lib/middlewareJwt/middlewareJwt");

const {
  cryptoGet,
  cryptosGet,
  cryptoCreate,
  cryptoUpdate,
  cryptoDelete,
} = require("./controller/cryptoController");

/* GET Cryptos Saved By Users */
router.get("/", middlewareJwt, cryptosGet);

router.get("/crypto-get/:id", middlewareJwt, cryptoGet);

router.post("/crypto-create", middlewareJwt, cryptoCreate);

router.put("/crypto-update", middlewareJwt, cryptoUpdate);

router.delete("/crypto-delete", middlewareJwt, cryptoDelete);

// function (req, res, next) {
//     res.json({
//         message: "hey i'm a cryptosRouter"
//     });

module.exports = router;
