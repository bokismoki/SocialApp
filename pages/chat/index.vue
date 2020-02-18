<template>
  <div class="chat">
    <div class="container mx-auto pt-5 pb-16 px-5">
      <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Chat</h1>
      <div class="md:flex">
        <div
          class="bg-white p-2 rounded border-2 border-gray-300 shadow-big self-start md:w-1/2 md:mr-5 lg:w-1/3"
        >
          <PreviousChats
            :previousChatUsers="previousChatUsers"
            :receiver_id="receiver_id"
            @emitNewChatF="emitNewChatF"
            @emitReceiverId="setReceiverId"
            @emitUser="emitUser"
          />
        </div>
        <div v-if="receiver_id" class="mt-10 max-w-xl md:w-1/2 md:mt-0 md:ml-5 lg:w-2/3">
          <ChatMessages :messages="messages" />
          <MessageForm :receiver_id="receiver_id" @newMsg="newMsg" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import io from 'socket.io-client'

export default {
  head: {
    title: 'Chat'
  },
  middleware: 'auth',
  components: {
    PreviousChats: () => import('~/components/PreviousChats'),
    ChatMessages: () => import('~/components/ChatMessages'),
    MessageForm: () => import('~/components/MessageForm')
  },
  data() {
    return {
      socket: io('https://social-app-social.herokuapp.com/api'),
      receiver_id: '',
      msg: '',
      messages: [],
      receiver_user: {}
    }
  },
  methods: {
    emitNewChatF() {
      this.receiver_id = ''
      this.messages = []
    },
    emitUser(user) {
      this.receiver_user = user
      this.setReceiverId(user.id)
      const userIsInPreviousChats = this.previousChatUsers.find(usr => {
        return usr.user_id === user.id
      })
      if (!userIsInPreviousChats) {
        this.previousChatUsers.push({
          name: user.name,
          image: user.image,
          user_id: user.id
        })
      }
    },
    setReceiverId(id) {
      this.getDBMessages(id)
      this.receiver_id = id
    },
    newMsg(msg) {
      this.messages.push(msg)
      this.scrollToBottomOfMessages()
    },
    getDBMessages(id) {
      if (this.receiver_id !== id) {
        this.$store.dispatch('setIsLoading', true)
        this.$axios
          .get(
            `/message/get/by_user/${
              this.$auth.user.id ? this.$auth.user.id : this.$auth.user.sub
            }/${id}`
          )
          .then(response => {
            if (!response.data.success) {
              this.$store.dispatch('setErrorMsg', response.data.msg)
              this.$router.push({ name: 'index' })
            } else {
              this.messages = response.data.messages
              this.scrollToBottomOfMessages()
            }
            this.$store.dispatch('setIsLoading', false)
          })
          .catch(err => {
            console.error(err)
            this.$store.dispatch('setIsLoading', false)
          })
      }
    },
    scrollToBottomOfMessages() {
      const messagesDiv = document.querySelector('.messages')
      setTimeout(() => {
        messagesDiv.scrollTop = messagesDiv.scrollHeight
      }, 100)
    },
    listenSocket() {
      this.socket.on('sendNewMsg', msg => {
        const isInPreviousChatUsers = this.previousChatUsers.find(user => {
          return user.user_id === msg.user_id
        })
        if (!isInPreviousChatUsers) {
          this.previousChatUsers.push({
            image: msg.user_image,
            name: msg.user_name,
            user_id: msg.user_id
          })
        }
      })
    }
  },
  async asyncData({ $axios, $auth, store, redirect }) {
    try {
      store.dispatch('setIsLoading', true)
      const previousChatUsers = await $axios.get(
        `/message/get/previous_chat_users/${
          $auth.user.id ? $auth.user.id : $auth.user.sub
        }`
      )
      store.dispatch('setIsLoading', false)
      return {
        previousChatUsers: previousChatUsers.data.previousChatUsers
      }
    } catch (err) {
      store.dispatch('setErrorMsg', err)
      redirect({ name: 'index' })
      store.dispatch('setIsLoading', false)
    }
  },
  mounted() {
    this.listenSocket()
  }
}
</script>

<style scoped>
.chat {
  margin-top: 80px;
}
</style>