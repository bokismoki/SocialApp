<template>
  <div class="post_options_modal">
    <img
      class="absolute top-0 right-0 w-5 cursor-pointer"
      src="~/assets/img/edit.svg"
      alt="Three dots icon"
      @click="toggleOptionsModal"
    />
    <div
      class="options_modal absolute hidden top-0 right-0 mt-5 p-1 shadow-lg bg-white border-2 border-gray-300"
    >
      <nuxt-link
        :to="{name: 'post-id', params: {id: post.post_id}}"
        class="w-full inline-block uppercase text-xs font-semibold px-2 py-1"
      >View Post</nuxt-link>
      <nuxt-link
        :to="{name: 'post-id-edit', params: {id: post.post_id}}"
        v-if="displayEdit"
        class="w-full inline-block uppercase text-xs font-semibold px-2 py-1"
      >Edit</nuxt-link>
      <button
        v-if="displayEdit"
        class="w-full flex uppercase text-xs font-semibold px-2 py-1"
        @click="deletePost"
      >Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostOptionsModal',
  props: ['post', 'index'],
  computed: {
    displayEdit() {
      if (this.$route.name !== 'profile') {
        return this.$auth.user.id === this.post.user_id
      } else {
        return true
      }
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
    deletePost() {
      this.$axios
        .delete(`/post/delete/${this.post.post_id}`)
        .then(response => {
          if (this.$route.name === 'post-id') {
            this.$router.push({ name: 'index' })
          } else {
            this.$emit('deletePost', this.index)
            const optionsModals = document.querySelectorAll('.options_modal')
            optionsModals.forEach(modal => modal.classList.add('hidden'))
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style scoped>
</style>