<template>
  <div class="comments_count">
    <nuxt-link
      :to="{name: 'post-id', params: {id: post.post_id}}"
      class="bg-blue-200 rounded-lg px-2 py-1 flex justify-center"
    >
      <div class="relative">
        <div
          class="count absolute text-xs font-black text-red-800 bg-white border border-gray-500 rounded-full w-5 h-5 flex justify-center"
        >{{comments_count}}</div>
        <img class="w-4" src="~/assets/img/comments.svg" alt="Gray comments icon" />
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'CommentsCount',
  props: ['post', 'comments_count']
}
</script>

<style scoped>
.count {
  top: -80%;
  right: -100%;
}
</style>