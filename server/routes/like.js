const authorization = require('../routes/authorization')

const router = require('express').Router()

const likeController = require('../controllers/like')

router.post('/set', authorization, likeController.set)

module.exports = router