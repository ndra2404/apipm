var express = require('express')
var router = express.Router()

const { companyController } = require('../controllers')

router.get('/', companyController.get)
router.get('/detail/:companyCode', companyController.getDetail)

module.exports = router
