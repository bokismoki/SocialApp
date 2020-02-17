<template>
  <div class="chat">
    <div class="container mx-auto pt-5 pb-16 px-5">
      <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Chat</h1>
      <div class="md:flex">
        <div class="bg-white p-2 rounded border-2 border-gray-300 shadow-big self-start md:w-1/2 md:mr-5 lg:w-1/3">
          <div class="users overflow-y-auto">
            <div class="flex items-center justify-between mb-3">
              <h1
                class="uppercase text-gray-800 font-semibold"
              >{{newChat ? 'Start a new chat' : 'Previous chats'}}</h1>
              <button
                class="bg-blue-600 text-white font-semibold px-3 py-1 rounded"
                @click="newChatF"
              >{{ newChat ? 'Old -' : 'New &plus;'}}</button>
            </div>
            <div v-if="!newChat">
              <p v-if="previousChatUsers.length <= 1">No previous chats, start a new one</p>
              <div v-else>
                <div v-for="(user, index) in previousChatUsers" :key="index">
                  <div v-if="user.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)">
                    <div
                      class="flex items-center cursor-pointer mb-1"
                      @click="setReceiverId(user.user_id)"
                    >
                      <img
                        class="w-12 h-12 rounded-full mr-2 border-2 border-blue-300"
                        :src="user.image"
                      />
                      <h1
                        class="text-xs font-semibold"
                        :class="{'text-blue-600 font-black': receiver_id === user.user_id}"
                      >{{user.name}}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="newChat">
            <SearchUser @emitUser="emitUser" />
          </div>
        </div>
        <div v-if="receiver_id" class="mt-10 max-w-xl md:w-1/2 md:mt-0 md:ml-5 lg:w-2/3">
          <div class="messages border-2 border-dashed border-gray-400 rounded p-2 overflow-y-auto">
            <h1 v-if="messages.length === 0">Start chatting!</h1>
            <div v-for="msg in messages" :key="msg.message_id">
              <div
                class="flex items-center mb-2"
                :class="{'justify-end': msg.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)}"
              >
                <div
                  v-if="msg.user_id === ($auth.user.id ? $auth.user.id : $auth.user.sub)"
                  class="user_image h-8 self-start"
                >
                  <img
                    :src="msg.user_image"
                    class="h-full rounded-full border-2 border-blue-300"
                    alt
                  />
                </div>
                <p
                  class="text-xs font-semibold rounded mx-2 px-2 py-1 break-words max-w-full"
                  :class="{'bg-blue-600 text-white': msg.user_id === ($auth.user.id ? $auth.user.id : $auth.user.sub), 'bg-gray-500': msg.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)}"
                >{{msg.body_text}}</p>
                <div
                  v-if="msg.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)"
                  class="user_image h-8 self-start"
                >
                  <img
                    :src="msg.user_image"
                    class="h-full rounded-full shadow border-2 border-blue-300"
                    alt
                  />
                </div>
              </div>
            </div>
          </div>
          <form class="mt-5" @submit.prevent="newMsg">
            <textarea
              class="px-1 placeholder-black text-sm rounded border-2 border-gray-300 w-full"
              type="text"
              placeholder="Type a message..."
              v-model="msg"
            ></textarea>
            <button
              class="uppercase text-sm bg-blue-600 w-full text-white mt-2 font-semibold tracking-wide py-1 rounded hover:bg-blue-500"
              type="submit"
            >Send</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
  head: {
    title: 'Chat'
  },
  middleware: 'auth',
  components: {
    SearchUser: () => import('~/components/SearchUser')
  },
  data() {
    return {
      newChat: false,
      receiver_id: '',
      msg: '',
      messages: [],
      receiver_user: {}
    }
  },
  computed: {
    ...mapGetters(['onlineUsers'])
  },
  methods: {
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
      this.newChat = false
    },
    setReceiverId(id) {
      this.showChat = true
      this.receiver_id = id
      this.getDBMessages(id)
    },
    getDBMessages(id) {
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
    },
    newMsg() {
      if (this.msg.trim()) {
        this.$axios
          .post(
            '/message/add',
            {
              body_text: this.msg.trim(),
              user_id: this.$auth.user.id
                ? this.$auth.user.id
                : this.$auth.user.sub,
              receiver_id: this.receiver_id
            },
            {
              headers: {
                'content-type': 'application/json'
              }
            }
          )
          .then(response => {
            if (!response.data.success) {
              this.$store.dispatch('setErrorMsg', response.data.msg)
              this.$router.push({ name: 'index' })
            } else {
              this.messages.push(response.data.message)
              this.scrollToBottomOfMessages()
            }
          })
          .catch(err => {
            console.error(err)
          })
        this.msg = ''
      }
    },
    newChatF() {
      this.newChat = !this.newChat
      this.receiver_id = ''
      this.messages = []
      this.msg = ''
    },
    scrollToBottomOfMessages() {
      const messagesDiv = document.querySelector('.messages')
      setTimeout(() => {
        messagesDiv.scrollTop = messagesDiv.scrollHeight
      }, 100)
    }
  },
  async asyncData({ $axios, $auth }) {
    const previousChatUsers = await $axios.get(
      `/message/get/previous_chat_users/${
        $auth.user.id ? $auth.user.id : $auth.user.sub
      }`
    )
    return {
      previousChatUsers: previousChatUsers.data.previousChatUsers
    }
  }
}
</script>

<style scoped>
.chat {
  margin-top: 80px;
}
.users {
  max-height: 200px;
}
.user_image {
  min-width: 2em;
}
.messages {
  height: 300px;
}
textarea {
  min-height: 100px;
  max-height: 150px;
}
@media (min-width: 768px) {
  .users {
    max-height: 300px;
  }
}
</style>