const router = require('express').Router()

const followController = require('../controllers/follow')

router.get('/get/by_user/:followee_id/:follower_id', followController.getByUser)

router.post('/set', followController.set)

module.exports = router