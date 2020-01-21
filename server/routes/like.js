const router = require('express').Router()

const likeController = require('../controllers/like')

router.get('/by_post/:id', likeController.getByPost)

module.exports = router