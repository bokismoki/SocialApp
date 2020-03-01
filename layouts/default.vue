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
    <div v-if="imageSrc">
      <ImageModal />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'

export default {
  head() {
    return {
      bodyAttrs: {
        class: this.imageSrc
          ? 'overflow-hidden'
          : ''
      }
    }
  },
  components: {
    NavBar: () => import('~/components/NavBar'),
    OnlineUsers: () => import('~/components/OnlineUsers'),
    ErrorAlert: () => import('~/components/ErrorAlert'),
    Loader: () => import('~/components/Loader'),
    ImageModal: () => import('~/components/ImageModal')
  },
  data() {
    return {
      socket: io('https://social-app-social.herokuapp.com')
    }
  },
  computed: {
    ...mapGetters(['errorMsg', 'isLoading', 'onlineUsers', 'imageSrc'])
  },
  methods: {
    listenSocket() {
      this.socket.on('sendOnlineUsers', onlineUsers => {
        this.$store.dispatch('setOnlineUsers', onlineUsers)
        this.onlineUsers
          .map(user => user.socketId)
          .forEach((arr, index) => {
            if (arr.length === 0) {
              this.$store.dispatch('spliceOnlineUsers', index)
            }
          })
      })
      this.socket.on('hasNotification', receiver_id => {
        if (
          (this.$auth.user.id ? this.$auth.user.id : this.$auth.user.sub) ===
          receiver_id
        ) {
          if (!this.$store.getters.hasNotifications) {
            this.$store.dispatch('setHasNotifications', true)
          }
        }
      })
      this.socket.on('addNewMsgNotification', info => {
        const { user_id, receiver_id } = info
        if (
          (this.$auth.user.id ? this.$auth.user.id : this.$auth.user.sub) ===
          receiver_id
        ) {
          this.$store.dispatch('addMessageNotification', { user_id })
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
</style>
