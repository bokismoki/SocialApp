const router = require('express').Router()

const commentController = require('../controllers/comment')

router.post('/add', commentController.add)

router.get('/by_id/:id', commentController.getById)

module.exports = router