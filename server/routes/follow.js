const authorization = require('../routes/authorization')

const router = require('express').Router()

const followController = require('../controllers/follow')

router.get('/get/by_user/:followee_id/:follower_id', followController.getByUser)

router.get('/get/count/by_user/:id', followController.getCountByUser)

router.get('/get/followed_users/:id', followController.getFollowedUsers)

router.post('/set', authorization, followController.set)

module.exports = router