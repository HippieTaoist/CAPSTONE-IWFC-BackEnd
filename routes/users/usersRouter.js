var express = require('express');
var router = express.Router();

const {
  getUsers
} = require('./controller/userController')

/* GET users listing. */
router.get('/', getUsers)

module.exports = router;