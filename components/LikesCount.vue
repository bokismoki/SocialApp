<template>
  <div class="likes_count">
    <button
      class="bg-blue-200 rounded mr-4 px-2 py-1 flex justify-center"
      :class="{'bg-blue-600': post.is_liked === 'yes'}"
      @click="likeDislike"
    >
      <div class="relative">
        <div
          class="count absolute text-xs font-black text-red-800 bg-white border border-gray-500 rounded-full w-5 h-5 flex justify-center"
        >{{likes_count > 99 ? 99 : likes_count}}</div>
        <img
          class="w-4"
          :src="post.is_liked === 'yes' ? likeWhiteSrc : likeSrc"
          alt="Gray like icon"
        />
      </div>
    </button>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'LikesCount',
  props: ['post', 'likes_count', 'index'],
  data() {
    return {
      socket: io('https://social-app-social.herokuapp.com'),
      likeWhiteSrc: require('~/assets/img/like_white.svg'),
      likeSrc: require('~/assets/img/like.svg')
    }
  },
  methods: {
    likeDislike() {
      this.$store.dispatch('setIsLoading', true)
      let post_id
      if (this.$route.name === 'post-id') {
        post_id = this.$route.params.id
      } else {
        post_id = this.post.post_id
      }
      this.$axios
        .post(
          '/like/set',
          {
            post_id,
            user_id: this.$auth.user.id
              ? this.$auth.user.id
              : this.$auth.user.sub
          },
          {
            headers: {
              'content-type': 'application/json'
            }
          }
        )
        .then(response => {
          if (response.data.success) {
            const { liked, disliked } = response.data
            if (liked) {
              if (this.$route.name !== 'post-id') {
                this.$emit('liked', this.index)
              } else {
                this.$emit('liked')
              }
              this.newNotificationLike()
            } else if (disliked) {
              if (this.$route.name !== 'post-id') {
                this.$emit('disliked', this.index)
              } else {
                this.$emit('disliked')
              }
            }
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
    },
    newNotificationLike() {
      if (
        (this.$auth.user.id ? this.$auth.user.id : this.$auth.user.sub) !==
        this.post.user_id && this.$route.name !== 'profile'
      ) {
        this.$axios
          .post(
            '/notification/add',
            {
              type: 'like',
              post_id: this.post.post_id,
              user_id: this.$auth.user.id
                ? this.$auth.user.id
                : this.$auth.user.sub,
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
            } else {
              this.socket.emit('newNotification', this.post.user_id)
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
.count {
  top: -80%;
  right: -100%;
}
</style>