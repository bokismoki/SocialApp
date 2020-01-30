<template>
  <div class="app">
    <NavBar />
    <nuxt />
    <div v-if="$route.name !== 'login'">
      <OnlineUsers :onlineUsers="onlineUsers" />
    </div>
    <div v-if="errorMsg">
      <ErrorAlert />
    </div>
    <div v-if="isLoading">
      <Loader />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'

export default {
  components: {
    NavBar: () => import('~/components/NavBar'),
    OnlineUsers: () => import('~/components/OnlineUsers'),
    ErrorAlert: () => import('~/components/ErrorAlert'),
    Loader: () => import('~/components/Loader')
  },
  data() {
    return {
      socket: io('https://social-app-social.herokuapp.com'),
      onlineUsers: []
    }
  },
  computed: {
    ...mapGetters(['errorMsg', 'isLoading'])
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

<style scoped>
.loader_container {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
