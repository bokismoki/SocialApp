const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const http = require('http')
const SocketIo = require('socket.io')
const app = express()

require('./db/mysql')

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))

const server = http.createServer(app)
const io = SocketIo(server)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

// SOCKET.IO
const onlineUsers = []
io.on('connection', socket => {
  socket.emit('getNewUser')
  socket.on('sendNewUser', user => {
    if (user.user) {
      if (typeof (onlineUsers.find(usr => usr.user.id === user.user.id)) !== 'undefined') {
        const index = onlineUsers.map(usr => usr.user.id).indexOf(user.user.id)
        onlineUsers[index].socketId.push(socket.id)
      } else {
        onlineUsers.push({ user: user.user, socketId: [socket.id] })
      }
      io.emit('sendOnlineUsers', onlineUsers)
    }
  })
  socket.on('disc', () => {
    socket.emit('disconnect')
  })

  socket.on('disconnect', () => {
    io.emit('userDisconnected', socket.id)
    let indexOfUser
    onlineUsers.map(user => user.socketId).forEach((arr, index) => {
      const idIndex = arr.indexOf(socket.id)
      if (idIndex !== -1) {
        indexOfUser = index
      }
    });
    if (typeof (indexOfUser) !== 'undefined') {
      const indexOfId = onlineUsers[indexOfUser].socketId.map(id => id).indexOf(socket.id)
      onlineUsers[indexOfUser].socketId.splice(indexOfId, 1)
      io.emit('sendOnlineUsers', onlineUsers)
    }
  })
})

// ROUTES
const userRoutes = require('./routes/user')
app.use('/api/user', userRoutes)

const postRoutes = require('./routes/post')
app.use('/api/post', postRoutes)

const commentRoutes = require('./routes/comment')
app.use('/api/comment', commentRoutes)

const likeRoutes = require('./routes/like')
app.use('/api/like', likeRoutes)

const followRoutes = require('./routes/follow')
app.use('/api/follow', followRoutes)

const notificationRoutes = require('./routes/notification')
app.use('/api/notification', notificationRoutes)