<template>
  <div class="previous_chats">
    <div class="users overflow-y-auto">
      <div class="flex items-center justify-between mb-3">
        <h1
          class="uppercase text-gray-800 font-semibold"
        >{{newChat ? 'Start a new chat' : 'Previous chats'}}</h1>
        <button
          class="bg-blue-600 text-white font-semibold px-3 py-1 rounded"
          @click="emitNewChatF"
        >{{ newChat ? 'Old -' : 'New &plus;'}}</button>
      </div>
      <div v-if="!newChat">
        <p v-if="previousChatUsers.length <= 1">No previous chats, start a new one</p>
        <div v-else>
          <div v-for="(user, index) in previousChatUsers" :key="index">
            <div v-if="user.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)">
              <div
                class="flex items-center cursor-pointer mb-1"
                @click="emitReceiverId(user.user_id)"
              >
                <img class="w-12 h-12 rounded-full mr-2 border-2 border-blue-300" :src="user.image" />
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
</template>

<script>
export default {
  name: 'PreviousChats',
  props: ['previousChatUsers', 'receiver_id'],
  components: {
    SearchUser: () => import('~/components/SearchUser')
  },
  data() {
    return {
      newChat: false
    }
  },
  methods: {
    emitNewChatF() {
      this.newChat = !this.newChat
      this.$emit('emitNewChatF')
    },
    emitReceiverId(id) {
      this.$emit('emitReceiverId', id)
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