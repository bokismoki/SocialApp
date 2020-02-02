<template>
  <div
    class="online_users fixed bottom-0 right-0 z-50 w-64 bg-white rounded border-2 border-gray-500"
  >
    <div
      class="users pl-2 pr-5 py-2 overflow-y-auto"
      v-if="toggleShowOnlineUsers && onlineUsers.length > 0"
    >
      <div class="mt-1" v-for="user in onlineUsers" :key="user.user.id">
        <div class="flex justify-between items-center">
          <nuxt-link
            class="flex items-center"
            :to="{name: 'profile-id', params: {id: user.user.id}}"
          >
            <img
              class="rounded-full w-8 h-8 mr-2 border-2 border-blue-300"
              :src="user.user.picture.data.url"
              alt="My Facebook profile image"
            />
            <h1 class="font-semibold text-xs">{{firstName(user.user.name)}}</h1>
          </nuxt-link>
          <div class="w-2 h-2 bg-green-700 rounded-full"></div>
        </div>
      </div>
    </div>
    <button
      class="text-gray-800 font-semibold w-full bg-gray-100 px-2 py-1 cursor-pointer focus:outline-none"
      @click="toggleShowOnlineUsers = !toggleShowOnlineUsers"
    >Online users</button>
  </div>
</template>

<script>
export default {
  name: 'OnlineUsers',
  props: ['onlineUsers'],
  data() {
    return {
      toggleShowOnlineUsers: false
    }
  },
  methods: {
    firstName(name) {
      return name.split(' ')[0]
    }
  }
}
</script>

<style scoped>
.users {
  max-height: 320px !important;
}
</style>