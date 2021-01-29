var express = require('express');
var router = express.Router();

const jwt = require('../middleware/jwt');
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.get('/verify', jwt.checkToken, authController.verify);

module.exports = router;