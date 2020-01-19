<template>
  <div class="post_item mb-10 border-2 border-gray-300 rounded-lg p-5">
    <div class="relative">
      <div class="flex items-center">
        <img class="rounded-full mr-2" :src="user.image" alt="My Facebook profile image" />
        <div>
          <h1 class="font-semibold">{{user.first_name}} {{user.last_name}}</h1>
          <div class="flex items-center">
            <p class="font-semibold text-xs mr-2">{{post.post_created_at}}</p>
            <img
              class="w-4"
              src="~/assets/img/network.svg"
              alt="Gray network icon"
              :class="{'opacity-50': !post.is_private}"
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
    <img class="mt-2" :src="post.body_image" alt="Post image" />
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: ['post', 'user'],
  methods: {
    truncate(text) {
      if (text.length >= 100) {
        return text.substring(0, 100) + '...'
      }
      return text
    }
  }
}
</script>

<style scoped>
</style>