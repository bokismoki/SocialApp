const router = require('express').Router()

const likeController = require('../controllers/like')

router.get('/get/by_post/:id', likeController.getByPost)

router.get('/get/public', likeController.public)

router.get('/get/for_profile/:id', likeController.getForProfile)

router.get('/get/public_by_user/:id', likeController.getPublicByUser)

router.post('/set', likeController.set)

module.exports = router