const authorization = require('../routes/authorization')

const router = require('express').Router()

const postController = require('../controllers/post')

router.get('/get/by_user/:id', postController.getByUser)

router.get('/get/by_id/:id', postController.getById)

router.get('/get/public', postController.getPublic)

router.post('/add', authorization, postController.add)

router.put('/update/:id', authorization, postController.update)

router.delete('/delete/:id', authorization, postController.delete)

module.exports = router