var express = require('express');
var router = express.Router();

const {
  middlewareJwt
} = require('../users/lib/middlewareJwt/middlewareJwt')

const {
  usersGet,
  userCreate,
  userLogin,
  userProfile,
  userUpdate
} = require('./controller/userController')

/* GET users listing. */
router.get('/', usersGet)

router.post('/user-create', userCreate)

router.post('/user-login', userLogin)

router.get('/user-profile', middlewareJwt, userProfile)

router.put('/user-update', middlewareJwt, userUpdate)

module.exports = router;