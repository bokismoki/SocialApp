const router = require('express').Router()

const commentController = require('../controllers/comment')

router.get('/get/by_id/:id', commentController.getById)

router.get('/get/by_post/:id', commentController.getByPost)

router.post('/add', commentController.add)

router.put('/update/:id', commentController.update)

router.delete('/delete/:id', commentController.delete)

module.exports = router