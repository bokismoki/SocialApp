<template>
  <div class="post_item mb-5 border-2 border-gray-300 rounded-lg p-5 bg-white">
    <div class="relative">
      <div class="flex items-center">
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
        <div>
          <h1
            v-if="post.first_name && post.last_name"
            class="font-semibold"
          >{{post.first_name}} {{post.last_name}}</h1>
          <h1 v-else class="font-semibold">{{user.first_name}} {{user.last_name}}</h1>
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
      <img
        class="absolute top-0 right-0 w-5 cursor-pointer"
        src="~/assets/img/edit.svg"
        alt="Three dots icon"
      />
    </div>
    <p class="mt-3">{{truncate(post.body_text)}}</p>
    <img v-if="post.body_image" class="mt-2" :src="post.body_image" alt="Post image" />
    <div class="flex mt-3">
      <button class="bg-blue-200 rounded-lg mr-1 px-2 py-1 flex justify-center b">
        <img class="w-4" src="~/assets/img/like.svg" alt="Gray like icon" />
      </button>
      <button class="bg-blue-200 rounded-lg px-2 py-1 flex justify-center b">
        <img class="w-4" src="~/assets/img/comments.svg" alt="Gray comments icon" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: ['post', 'user'],
  methods: {
    truncate(text) {
      if (text) {
        if (text.length >= 100) {
          return text.substring(0, 100) + '...'
        }
        return text
      }
    },
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