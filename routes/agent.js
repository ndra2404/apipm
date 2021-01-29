var express = require('express')
var router = express.Router()


const { jwt } = require('../middleware')
const { topController } = require('../controllers')

router.post('/topup', jwt.checkToken,topController.topUp)
module.exports = router