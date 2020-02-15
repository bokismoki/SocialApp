<template>
  <div class="app">
    <NavBar @disconnect="disconnect" />
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
      this.socket.on('sendOnlineUsers', onlineUsers => {
        this.onlineUsers = onlineUsers
        this.onlineUsers
          .map(user => user.socketId)
          .forEach((arr, index) => {
            if (arr.length === 0) {
              this.onlineUsers.splice(index, 1)
            }
          })
      })
      this.socket.on('hasNotification', receiver_id => {
        if ((this.$auth.user.id || this.$auth.user.sub) === receiver_id) {
          if (!this.$store.getters.hasNotifications) {
            this.$store.dispatch('setHasNotifications', true)
          }
        }
      })
    },
    disconnect() {
      this.socket.emit('disc')
    }
  },
  mounted() {
    if (!this.$route.name.includes('login')) {
      this.socket.on('getNewUser', () => {
        if (this.$auth.strategy.name === 'facebook') {
          this.socket.emit('sendNewUser', {
            user: this.$auth.user
          })
        } else {
          const user = {
            email: this.$auth.user.email,
            id: this.$auth.user.sub,
            name: this.$auth.user.name,
            picture: {
              data: {
                url: this.$auth.user.picture
              }
            }
          }
          this.socket.emit('sendNewUser', { user })
        }
      })
      this.listenSocket()
    }
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
