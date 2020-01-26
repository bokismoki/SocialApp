<template>
  <div class="app">
    <NavBar />
    <div v-if="$route.name !== 'login'">
      <OnlineUsers :onlineUsers="onlineUsers" />
    </div>
    <nuxt />
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  components: {
    NavBar: () => import('~/components/NavBar'),
    OnlineUsers: () => import('~/components/OnlineUsers')
  },
  data() {
    return {
      socket: io('http://localhost:3000'),
      onlineUsers: []
    }
  },
  methods: {
    listenSocket() {
      this.socket.on('shareNewUser', user => {
        const isOnline = this.onlineUsers.find(
          user => user.id === this.$auth.user.id
        )
        if (typeof isOnline === 'undefined') {
          this.onlineUsers.push(user)
        }
      })

      this.socket.on('shareDisconnectedUser', index => {
        if (this.onlineUsers[index].id !== this.$auth.user.id) {
          this.onlineUsers.splice(index, 1)
        }
      })
    }
  },
  mounted() {
    this.socket.emit('newUserConnected', {
      user: this.$auth.user,
      index: this.onlineUsers.length
    })
    this.listenSocket()
  }
}
</script>

<style>
*,
*:before,
*:after {
  @apply m-0;
  @apply p-0;
  box-sizing: border-box;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  scroll-behavior: smooth;
  @apply bg-blue-100;
}
</style>
