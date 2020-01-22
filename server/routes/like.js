const router = require('express').Router()

const likeController = require('../controllers/like')

router.get('/by_post/:id', likeController.getByPost)

router.post('/set', likeController.set)

module.exports = router