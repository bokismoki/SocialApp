<template>
  <div class="search_user_item">
    <div class="mb-2">
      <div v-if="$route.name === 'index'">
        <nuxt-link
          :to="{name: 'profile-id', params: {id: user.id}}"
          class="flex items-center w-auto"
        >
          <img
            class="w-10 h-10 rounded-full mr-3 border-2 border-blue-300"
            :src="user.image"
            alt="Facebook profile image"
          />
          <h1 class="text-xs">{{user.name}}</h1>
        </nuxt-link>
      </div>
      <div v-else class="flex items-center w-auto cursor-pointer" @click="emitUser(user)">
        <img
          class="w-10 h-10 rounded-full mr-3 border-2 border-blue-300"
          :src="user.image"
          alt="Facebook profile image"
        />
        <h1 class="text-xs">{{user.name}}</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchUserItem',
  props: ['user'],
  methods: {
    emitUser(user) {
      this.$emit('emitUser', user)
    }
  }
}
</script>

<style scoped>
</style>