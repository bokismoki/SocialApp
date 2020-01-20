const router = require('express').Router()

const postController = require('../controllers/post')

router.get('/by_user/:id', postController.getByUser)

router.get('/by_id/:id', postController.getById)

router.get('/all_public', postController.getPublic)

router.post('/add', postController.add)

module.exports = router