var express = require('express')
var router = express.Router()

const { jwt } = require('../middleware')
const { userController } = require('../controllers/')
// router.get('/', jwt.checkToken, userController.get)
// router.put('/', userController.update)
// router.put('/change_password', jwt.checkToken, userController.changePassword)
// router.delete('/', userController.destroy)
// router.post('/', userController.create)
// router.get('/me', jwt.checkToken, userController.me)
router.get('/profile', jwt.checkToken, userController.profile)
router.post('/createagent',userController.createagent)
module.exports = router
