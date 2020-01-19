const router = require('express').Router()

const postController = require('../controllers/post')

router.get('/by_user/:id', postController.getByUser)

module.exports = router