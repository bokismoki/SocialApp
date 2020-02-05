<template>
  <div class="settings">
    <div class="container mx-auto pt-5 pb-16 px-5">
      <div class="max-w-lg">
        <nuxt-link
          :to="{name: 'privacy'}"
          class="text-sm uppercase text-white font-semibold px-2 py-1 block bg-blue-600 rounded"
        >Privacy</nuxt-link>
        <nuxt-link
          :to="{name: 'profile'}"
          class="text-sm uppercase text-white mt-5 font-semibold px-2 py-1 block bg-blue-600 rounded"
        >Manage posts</nuxt-link>
        <nuxt-link
          :to="{name: 'index'}"
          class="text-sm uppercase text-white mt-5 font-semibold px-2 py-1 block bg-blue-600 rounded"
        >Manage comments</nuxt-link>
        <div
          class="text-sm uppercase text-white mt-5 font-semibold px-2 py-1 block bg-blue-600 rounded"
        >Following</div>
        <div v-if="followedUsers.length > 0">
          <div v-for="follow in followedUsers" :key="follow.id">
            <div class="flex items-center mt-3">
              <nuxt-link :to="{name: 'profile-id', params: {id: follow.id}}">
                <img
                  class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
                  :src="follow.image"
                  alt="Facebook profile image"
                />
              </nuxt-link>
              <nuxt-link :to="{name: 'profile-id', params: {id: follow.id}}">
                <h1 class="font-semibold">{{follow.first_name}} {{follow.last_name}}</h1>
              </nuxt-link>
            </div>
          </div>
        </div>
        <div class="mt-2" v-else>
          <p>No followers to display</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Settings'
  },
  middleware: 'auth',
  async asyncData({ $axios, $auth, store, redirect }) {
    try {
      store.dispatch('setIsLoading', true)
      const followedUsers = await $axios.get(
        `/follow/get/followed_users/${$auth.user.id}`
      )
      store.dispatch('setIsLoading', false)
      return {
        followedUsers: followedUsers.data.followedUsers
      }
    } catch (err) {
      store.dispatch('setErrorMsg', err)
      redirect({ name: 'index' })
      store.dispatch('setIsLoading', false)
    }
  }
}
</script>

<style scoped>
.settings {
  margin-top: 80px;
}
</style>