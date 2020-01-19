const router = require('express').Router()

const userController = require('../controllers/user')

router.get('/get/:id', userController.get)

router.post('/login', userController.login)

module.exports = router