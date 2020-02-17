const authorization = require('../routes/authorization')

const router = require('express').Router()

const messageController = require('../controllers/message')

router.get('/get/by_user/:user_id/:receiver_id', messageController.getByUser)

router.get('/get/previous_chat_users/:id', messageController.getPreviousChatUsers)

router.post('/add', authorization, messageController.add)

module.exports = router