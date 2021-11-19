var express = require('express');
var router = express.Router();

const {
  usersGet,
  userCreate,
  userLogin,
} = require('./controller/userController')

/* GET users listing. */
router.get('/', usersGet)

router.post('/create-user', userCreate)

router.post('/login-user', userLogin)

module.exports = router;