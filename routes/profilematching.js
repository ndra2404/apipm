var express = require('express')
var router = express.Router()

const { pMController } = require('../controllers')

router.get('/dohitung', pMController.doHitung)

module.exports = router