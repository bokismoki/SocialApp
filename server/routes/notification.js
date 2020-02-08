const authorization = require('../routes/authorization')

const router = require('express').Router()

const notificationController = require('../controllers/notification')

router.get('/get/by_user/:id', authorization, notificationController.getByUser)

router.post('/add', authorization, notificationController.add)

router.delete('/delete/:id', authorization, notificationController.delete)

module.exports = router