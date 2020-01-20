const router = require('express').Router()

const commentController = require('../controllers/comment')

router.post('/add', commentController.add)

module.exports = router