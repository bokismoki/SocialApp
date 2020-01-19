const router = require('express').Router()

const postController = require('../controllers/post')

router.get('/by_user/:id', postController.getByUser)

router.post('/add', postController.add)

module.exports = router