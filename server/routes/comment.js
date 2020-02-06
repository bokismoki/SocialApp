const authorization = require('../routes/authorization')

const router = require('express').Router()

const commentController = require('../controllers/comment')

router.get('/get/by_id/:id', commentController.getById)

router.get('/get/by_post/:id/:limit_index', commentController.getByPost)

router.get('/get/count/by_post/:id', commentController.getCountByPost)

router.post('/add', authorization, commentController.add)

router.put('/update/:id', authorization, commentController.update)

router.delete('/delete/:id', authorization, commentController.delete)

module.exports = router