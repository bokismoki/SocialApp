const router = require('express').Router()

const userController = require('../controllers/user')

router.get('/get/:id', userController.getById)

router.get('/get/by_input/:input', userController.getByInput)

router.post('/login', userController.login)

router.post('/token', userController.token)

module.exports = router