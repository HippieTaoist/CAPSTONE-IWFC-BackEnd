var express = require("express");
var router = express.Router();

const {
  middlewareJwt,
} = require("../../routes/users/lib/middlewareJwt/middlewareJwt");

const {
  cryptoProgramsGet,
  cryptoProgramCreate,
  cryptoProgramUpdate,
  cryptoProgramDelete,
} = require("./controller/cryptosProgramsController");

/* GET cryptoProgramsGetAll */
router.get("/", cryptoProgramsGet);

router.post("/crypto-program-create", middlewareJwt, cryptoProgramCreate);

router.put("/crypto-program-update", middlewareJwt, cryptoProgramUpdate);

router.delete("/crypto-program-delete", middlewareJwt, cryptoProgramDelete);

module.exports = router;
