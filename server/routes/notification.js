const router = require('express').Router()

const notificationController = require('../controllers/notification')

router.get('/get/by_user/:id', notificationController.getByUser)

router.post('/add', notificationController.add)

router.delete('/delete/:id', notificationController.delete)

module.exports = router