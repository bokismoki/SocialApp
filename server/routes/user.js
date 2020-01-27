const router = require('express').Router()

const userController = require('../controllers/user')

router.get('/get/:id', userController.get)

router.post('/login', userController.login)

router.post('/token', userController.token)

module.exports = router