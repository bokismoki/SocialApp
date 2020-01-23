const router = require('express').Router()

const commentController = require('../controllers/comment')

router.post('/add', commentController.add)

router.get('/by_post/:id', commentController.getById)

router.delete('/delete/:id', commentController.delete)

module.exports = router