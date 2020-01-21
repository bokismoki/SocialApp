<template>
  <div class="comment_item bg-white mb-5 p-5 rounded-lg border-2 border-gray-300">
    <div class="relative">
      <div class="flex items-center">
        <nuxt-link :to="{name: 'profile-id', params: {id: comment.user_id}}">
          <img
            class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
            :src="comment.image"
            alt="Facebook profile image"
          />
        </nuxt-link>
        <div>
          <nuxt-link :to="{name: 'profile-id', params: {id: comment.user_id}}">
            <h1 class="font-semibold">{{comment.first_name}} {{comment.last_name}}</h1>
          </nuxt-link>
          <div class="flex items-center">
            <p class="font-semibold text-xs mr-2">{{formatDate(comment.created_at)}}</p>
          </div>
        </div>
      </div>
      <p class="mt-3">{{truncate(comment.body_text)}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: ['comment'],
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