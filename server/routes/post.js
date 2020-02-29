const authorization = require('../routes/authorization')

const router = require('express').Router()

const postController = require('../controllers/post')

router.get('/get/by_user/:visitor_id/:id/:limit_index', postController.getByUser)

router.get('/get/count/by_user/:id', postController.getCountByUser)

router.get('/get/by_id/:user_id/:id', postController.getById)

router.get('/get/public/:id/:limit_index', postController.getPublic)

router.get('/get/count/public', postController.getCountPublic)

router.post('/add', authorization, postController.add)

router.put('/update/:id', authorization, postController.update)

router.delete('/delete/:id', authorization, postController.delete)

module.exports = router