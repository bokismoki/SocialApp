<template>
  <div class="comment_item bg-white mb-5 p-5 rounded-lg border-2 border-gray-300">
    <div class="relative">
      <CommentAuthor :comment="comment" />
      <p class="mt-3 break-words">{{comment.body_text}}</p>
      <CommentOptionsModal :comment="comment" :index="index" @deleteComment="deleteComment" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: ['comment', 'index'],
  components: {
    CommentAuthor: () => import('~/components/CommentAuthor'),
    CommentOptionsModal: () => import('~/components/CommentOptionsModal')
  },
  methods: {
    formatDate(date) {
      if (date) {
        return date.substring(0, 10)
      }
    },
    deleteComment(payload) {
      this.$emit('deleteComment', payload)
    }
  }
}
</script>

<style scoped>
</style>