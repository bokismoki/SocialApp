const router = require('express').Router()

const commentController = require('../controllers/comment')

router.get('/get/by_post/:id', commentController.getByPost)

router.post('/add', commentController.add)

router.delete('/delete/:id', commentController.delete)

module.exports = router