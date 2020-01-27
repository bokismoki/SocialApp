const authorization = require('../routes/authorization')

const router = require('express').Router()

const likeController = require('../controllers/like')

router.get('/get/count/by_post/:id', likeController.getCountByPost)

router.get('/get/count/public', likeController.getCountPublic)

router.get('/get/count/for_profile/:id', likeController.getCountForProfile)

router.get('/get/count/public_by_user/:id', likeController.getCountPublicByUser)

router.post('/set', authorization, likeController.set)

module.exports = router