const authorization = require('../routes/authorization')

const router = require('express').Router()

const notificationController = require('../controllers/notification')

router.get('/get/by_user/:id', notificationController.getByUser)

router.get('/get/count/:id', notificationController.getCount)

router.post('/add', authorization, notificationController.add)

router.delete('/delete/:id', authorization, notificationController.delete)

router.delete('/delete_all/:id', authorization, notificationController.deleteAll)

module.exports = router