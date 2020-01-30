<template>
  <div class="search_user_item">
    <div class="mb-2">
      <nuxt-link :to="{name: 'profile-id', params: {id: user.id}}" class="flex items-center w-auto">
        <img class="w-10 h-10 rounded-full mr-3" :src="user.image" alt="Facebook profile image" />
        <h1 class="text-xs">{{user.name}}</h1>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchUserItem',
  props: ['user']
}
</script>

<style scoped>
</style>