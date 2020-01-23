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
      <p class="mt-3">{{comment.body_text}}</p>
      <img
        class="absolute top-0 right-0 w-5 cursor-pointer"
        src="~/assets/img/edit.svg"
        alt="Three dots icon"
        v-if="displayEdit"
        @click="toggleOptionsModal"
      />
      <div
        class="absolute hidden top-0 right-0 mt-5 p-1 shadow-lg bg-white border-2 border-gray-300"
      >
        <div class="w-full uppercase text-xs font-semibold px-2 py-1">Edit</div>
        <button class="w-full uppercase text-xs font-semibold px-2 py-1" @click="deleteComment">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: ['comment'],
  computed: {
    displayEdit() {
      return this.comment.user_id === this.$auth.user.id
    }
  },
  methods: {
    formatDate(date) {
      if (date) {
        return date.substring(0, 10)
      }
    },
    toggleOptionsModal(e) {
      const optionModal = e.target.nextElementSibling
      if (optionModal.classList.contains('hidden')) {
        optionModal.classList.remove('hidden')
      } else {
        optionModal.classList.add('hidden')
      }
    },
    deleteComment() {
      this.$axios
        .delete(`/comment/delete/${this.comment.comment_id}`)
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style scoped>
</style>