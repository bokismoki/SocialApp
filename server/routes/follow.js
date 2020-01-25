const router = require('express').Router()

const followController = require('../controllers/follow')

router.get('/get/by_user/:followee_id/:follower_id', followController.getByUser)

router.get('/get/count/by_user/:id', followController.getCountByUser)

router.post('/set', followController.set)

module.exports = router