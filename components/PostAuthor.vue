<template>
  <div class="post_author">
    <div class="flex items-center">
      <nuxt-link :to="href">
        <img
          v-if="post.image"
          class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
          :src="post.image"
          alt="Facebook profile image"
        />
        <img
          v-else
          class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
          :src="user.image"
          alt="My Facebook profile image"
        />
      </nuxt-link>
      <div>
        <nuxt-link :to="href">
          <h1
            v-if="post.first_name && post.last_name"
            class="font-semibold"
          >{{post.first_name}} {{post.last_name}}</h1>
          <h1 v-else class="font-semibold">{{user.first_name}} {{user.last_name}}</h1>
        </nuxt-link>
        <div class="flex items-center">
          <p class="font-semibold text-xs mr-2">{{formatDate(post.created_at)}}</p>
          <img
            class="w-4"
            src="~/assets/img/network.svg"
            alt="Gray network icon"
            :class="{'opacity-50': post.is_private}"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostAuthor',
  props: ['post', 'user'],
  computed: {
    href() {
      if (this.$route.name === 'profile') {
        return { name: this.$route.name }
      } else if (this.$route.name === 'profile-id') {
        return { name: this.$route.name, params: { id: this.$route.params.id } }
      } else {
        return { name: 'profile-id', params: { id: this.post.user_id } }
      }
    }
  },
  methods: {
    formatDate(date) {
      if (date) {
        return date.substring(0, 10)
      }
    }
  }
}
</script>

<style scoped>
</style>