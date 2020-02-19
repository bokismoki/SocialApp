const authorization = require('../routes/authorization')

const router = require('express').Router()

const messageController = require('../controllers/message')

router.get('/get/by_user/:user_id/:receiver_id', messageController.getByUser)

router.get('/get/previous_chat_users/:id', messageController.getPreviousChatUsers)

router.get('/get/unread/:id', messageController.getUnread)

router.post('/add', authorization, messageController.add)

router.put('/update/:id', authorization, messageController.update)

module.exports = router