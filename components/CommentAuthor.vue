<template>
  <div class="comment_author">
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
  </div>
</template>

<script>
export default {
  name: 'CommentAuthor',
  props: ['comment'],
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