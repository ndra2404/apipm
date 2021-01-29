var express = require('express')
var router = express.Router()


const { jwt } = require('../middleware')
const { KreteriaController } = require('../controllers')

router.post('/insertCreteria', jwt.checkToken,KreteriaController.insertCreteria)
router.post('/insertSubCreteria', jwt.checkToken,KreteriaController.insertSubCreteria)
router.get('/getCreteria', jwt.checkToken,KreteriaController.getCreteria)
router.get('/getSubCreteria/:kd', jwt.checkToken,KreteriaController.getSubCreteria)
module.exports = router