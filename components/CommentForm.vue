<template>
  <div class="comment_form">
    <form @submit.prevent="newComment">
      <textarea
        class="px-2 py-1 placeholder-black w-full rounded border-2 border-gray-300"
        :class="{'border-red-500': isBodyTextOverLimit}"
        placeholder="Write a comment"
        v-model="bodyText"
      ></textarea>
      <div
        class="text-xs opacity-75"
        :class="{'text-red-600 font-black': isBodyTextOverLimit}"
      >{{charactersLeft}}</div>
      <button
        class="uppercase text-sm bg-blue-600 w-full text-white mt-2 font-semibold tracking-wide py-1 rounded hover:bg-blue-500"
        type="submit"
      >Comment</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CommentForm',
  props: ['post'],
  data() {
    return {
      bodyText: ''
    }
  },
  computed: {
    charactersLeft() {
      if (this.bodyText) {
        return 255 - this.bodyText.trim().length
      }
    },
    isBodyTextOverLimit() {
      return this.charactersLeft < 0
    }
  },
  methods: {
    newComment() {
      if (this.bodyText.trim() && !this.isBodyTextOverLimit) {
        this.$store.dispatch('setIsLoading', true)
        if (this.$route.name === 'comment-id-edit') {
          this.$axios
            .put(`/comment/update/${this.$route.params.id}`, {
              body_text: this.bodyText.trim(),
              user_id: this.$auth.user.id
            })
            .then(response => {
              if (response.data.success) {
                this.$router.push({ name: 'index' })
              } else {
                this.$store.dispatch('setErrorMsg', response.data.msg)
                this.$router.push({ name: 'index' })
              }
              this.$store.dispatch('setIsLoading', false)
            })
            .catch(err => {
              console.error(err)
              this.$store.dispatch('setIsLoading', false)
            })
        } else {
          this.$axios
            .post(
              '/comment/add',
              {
                body_text: this.bodyText.trim(),
                post_id: this.$route.params.id,
                user_id: this.$auth.user.id
              },
              {
                headers: {
                  'content-type': 'application/json'
                }
              }
            )
            .then(response => {
              if (response.data.success) {
                this.$emit('newComment', response.data.comment)
                this.bodyText = ''
                this.newNotificationComment()
              } else {
                this.$store.dispatch('setErrorMsg', response.data.msg)
                this.$router.push({ name: 'index' })
              }
              this.$store.dispatch('setIsLoading', false)
            })
            .catch(err => {
              console.error(err)
              this.$store.dispatch('setIsLoading', false)
            })
        }
      }
    },
    newNotificationComment() {
      if (this.$auth.user.id !== this.post.user_id) {
        this.$axios
          .post(
            '/notification/add',
            {
              type: 'comment',
              post_id: this.$route.params.id,
              user_id: this.$auth.user.id,
              receiver_id: this.post.user_id
            },
            {
              headers: {
                'content-type': 'application/json'
              }
            }
          )
          .then(response => {
            if (!response.data.success) {
              this.$store.dispatch('setErrorMsg', response.data.msg)
              this.$router.push({ name: 'index' })
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }
}
</script>

<style scoped>
textarea {
  min-height: 100px;
  max-height: 150px;
}
</style>