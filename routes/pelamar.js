var express = require('express')
var router = express.Router()


const { jwt } = require('../middleware')
const { pelamarController } = require('../controllers')

router.post('/insertPelamar', jwt.checkToken,pelamarController.insertPelamar)
router.post('/updatePelamar/:id', jwt.checkToken,pelamarController.updatePelamar)
router.get('/getPelamar', jwt.checkToken,pelamarController.getPelamar)
module.exports = router