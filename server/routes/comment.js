const authorization = require('../routes/authorization')

const router = require('express').Router()

const commentController = require('../controllers/comment')

router.get('/get/by_id/:id', commentController.getById)

router.get('/get/by_post/:id', commentController.getByPost)

router.get('/get/count/public', commentController.getCountPublic)

router.get('/get/count/for_profile/:id', commentController.getCountForProfile)

router.get('/get/count/public_by_user/:id', commentController.getCountPublicByUser)

router.post('/add', authorization, commentController.add)

router.put('/update/:id', authorization, commentController.update)

router.delete('/delete/:id', authorization, commentController.delete)

module.exports = router