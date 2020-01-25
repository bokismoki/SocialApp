<template>
  <div class="likes_count">
    <button class="bg-blue-200 rounded-lg mr-4 px-2 py-1 flex justify-center" @click="likeDislike">
      <div class="relative">
        <div
          class="count absolute text-xs font-black text-red-800 bg-white border border-gray-500 rounded-full w-5 h-5 flex justify-center"
        >{{likes_count}}</div>
        <img class="w-4" src="~/assets/img/like.svg" alt="Gray like icon" />
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'LikesCount',
  props: ['post', 'likes_count', 'index'],
  methods: {
    likeDislike() {
      let post_id
      if (this.$route.name === 'post-id') {
        post_id = this.$route.params.id
      } else {
        post_id = this.post.post_id
      }
      this.$axios
        .post(
          '/like/set',
          { post_id, user_id: this.$auth.user.id },
          {
            headers: {
              'content-type': 'application/json'
            }
          }
        )
        .then(response => {
          const { liked, disliked } = response.data
          if (liked) {
            if (this.$route.name !== 'post-id') {
              this.$emit('liked', this.index)
            } else {
              this.$emit('liked')
            }
          } else if (disliked) {
            if (this.$route.name !== 'post-id') {
              this.$emit('disliked', this.index)
            } else {
              this.$emit('disliked')
            }
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
.count {
  top: -80%;
  right: -100%;
}
</style>