const router = require('express').Router()

const postController = require('../controllers/post')

router.get('/get/by_user/:id', postController.getByUser)

router.get('/get/by_id/:id', postController.getById)

router.get('/get/public', postController.getPublic)

router.post('/add', postController.add)

router.delete('/delete/:id', postController.delete)

module.exports = router