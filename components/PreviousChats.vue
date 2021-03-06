<template>
  <div class="previous_chats">
    <div class="users overflow-y-auto">
      <div class="flex items-center justify-between mb-3">
        <h1
          class="uppercase text-gray-800 font-semibold"
        >{{newChat ? 'Start a new chat' : 'Previous chats'}}</h1>
        <button
          class="bg-blue-600 text-white font-semibold px-3 py-1 rounded"
          @click="toggleNewChat"
        >{{ newChat ? 'Old -' : 'New &plus;'}}</button>
      </div>
      <div v-if="!newChat">
        <p v-if="previousChatUsers.length < 1">No previous chats, start a new one</p>
        <div v-else>
          <div v-for="(user, index) in previousChatUsers" :key="index">
            <div v-if="user.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)">
              <div
                class="flex items-center justify-between cursor-pointer mb-1"
                @click="emitReceiverId(user.user_id); emitReceiverName(user.name); msgRead(user)"
              >
                <div class="flex items-center">
                  <div class="relative mr-2">
                    <img class="w-12 h-12 rounded-full border-2 border-blue-300" :src="user.image" />
                    <div v-if="isUnread(user.user_id)">
                      <NotificationsIndicator />
                    </div>
                  </div>
                  <h1
                    class="text-xs font-semibold"
                    :class="{'text-blue-600 font-black': receiver_id === user.user_id}"
                  >{{user.name}}</h1>
                </div>
                <div v-if="isOnline(user.user_id)" class="w-2 h-2 bg-green-700 rounded-full"></div>
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PreviousChats',
  props: ['previousChatUsers', 'receiver_id'],
  components: {
    SearchUser: () => import('~/components/SearchUser'),
    NotificationsIndicator: () => import('~/components/NotificationsIndicator')
  },
  data() {
    return {
      newChat: false
    }
  },
  computed: {
    ...mapGetters(['onlineUsers', 'messageNotifications'])
  },
  methods: {
    msgRead(user) {
      if (this.messageNotifications.find(msg => msg.user_id === user.user_id)) {
        this.$store.dispatch('setIsLoading', true)
        this.$axios
          .put(
            `/message/update/${
              this.$auth.user.id ? this.$auth.user.id : this.$auth.user.sub
            }`,
            {
              receiver_id: user.user_id,
              user_id: this.$auth.user.id
                ? this.$auth.user.id
                : this.$auth.user.sub
            },
            {
              headers: {
                'content-type': 'application/json'
              }
            }
          )
          .then(response => {
            if (response.data.success) {
              this.$store.dispatch('removeMessageNotification', user.user_id)
            } else {
              this.$store.dispatch('setErrorMsg', response.data.msg)
              this.$router.push({ name: 'index' })
            }
            this.$store.dispatch('setIsLoading', false)
          })
          .catch(err => {
            console.error(err)
            this.$store.dispatch('setIsLoading', false)
          })
      }
    },
    isUnread(id) {
      return this.messageNotifications.find(msg => msg.user_id === id)
    },
    isOnline(id) {
      const userIsOnline = this.onlineUsers.find(user => {
        return user.user.id === id
      })
      return userIsOnline ? true : false
    },
    toggleNewChat() {
      this.newChat = !this.newChat
    },
    emitReceiverId(id) {
      this.$emit('emitReceiverId', id)
    },
    emitReceiverName(name) {
      this.$emit('emitReceiverName', name)
    },
    emitUser(user) {
      this.newChat = false
      this.$emit('emitUser', user)
    }
  }
}
</script>

<style scoped>
.users {
  max-height: 200px;
}
@media (min-width: 768px) {
  .users {
    max-height: 300px;
  }
}
</style>