<template>
  <div class="comment_options_modal">
    <img
      class="absolute top-0 right-0 w-5 cursor-pointer"
      src="~/assets/img/edit.svg"
      alt="Three dots icon"
      v-if="displayEdit"
      @click="toggleOptionsModal"
    />
    <div
      class="absolute hidden top-0 right-0 mt-5 p-1 shadow-big bg-white rounded border-2 border-gray-300"
    >
      <nuxt-link
        :to="{name: 'comment-id-edit', params: {id: this.comment.comment_id}}"
        class="w-full uppercase text-xs font-semibold px-2 py-1"
      >Edit</nuxt-link>
      <button
        class="w-full flex uppercase text-xs font-semibold px-2 py-1"
        @click="deleteComment"
      >Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentOptionsModal',
  props: ['comment', 'index'],
  computed: {
    displayEdit() {
      return this.comment.user_id === this.$auth.user.id
    }
  },
  methods: {
    toggleOptionsModal(e) {
      const optionModal = e.target.nextElementSibling
      if (optionModal.classList.contains('hidden')) {
        optionModal.classList.remove('hidden')
      } else {
        optionModal.classList.add('hidden')
      }
    },
    deleteComment() {
      this.$store.dispatch('setIsLoading', true)
      this.$axios
        .delete(`/comment/delete/${this.comment.comment_id}`, {
          data: {
            user_id: this.$auth.user.id
          }
        })
        .then(response => {
          this.$emit('deleteComment', this.index)
          this.$store.dispatch('setIsLoading', false)
        })
        .catch(err => {
          console.error(err)
          this.$store.dispatch('setIsLoading', false)
        })
    }
  }
}
</script>

<style scoped>
</style>