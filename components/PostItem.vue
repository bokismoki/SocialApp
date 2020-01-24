<template>
  <div class="post_item mb-5 border-2 border-gray-300 rounded-lg p-5 bg-white">
    <div class="relative">
      <PostAuthor :post="post" :user="user" />
      <PostOptionsModal :post="post" :index="index" @deletePost="deletePost" />
    </div>
    <p v-if="$route.name !== 'post-id'" class="mt-3">{{truncate(post.body_text)}}</p>
    <p v-else class="mt-3">{{post.body_text}}</p>
    <img v-if="post.body_image" class="mt-2" :src="post.body_image" alt="Post image" />
    <div class="flex mt-5">
      <nuxt-link
        :to="{name: 'post-id', params: {id: post.post_id}}"
        class="bg-blue-200 rounded-lg mr-4 px-2 py-1 flex justify-center"
      >
        <div class="relative" @click="likeDislike">
          <div
            class="count absolute text-xs font-black text-red-800 bg-white border border-gray-500 rounded-full w-5 h-5 flex justify-center"
            v-if="$route.name === 'post-id'"
          >{{likes_count}}</div>
          <img class="w-4" src="~/assets/img/like.svg" alt="Gray like icon" />
        </div>
      </nuxt-link>
      <nuxt-link
        :to="{name: 'post-id', params: {id: post.post_id}}"
        class="bg-blue-200 rounded-lg px-2 py-1 flex justify-center"
      >
        <div class="relative">
          <div
            class="count absolute text-xs font-black text-red-800 bg-white border border-gray-500 rounded-full w-5 h-5 flex justify-center"
            v-if="$route.name === 'post-id'"
          >{{comments_count}}</div>
          <img class="w-4" src="~/assets/img/comments.svg" alt="Gray comments icon" />
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: ['post', 'user', 'likes_count', 'comments_count', 'index'],
  components: {
    PostAuthor: () => import('~/components/PostAuthor'),
    PostOptionsModal: () => import('~/components/PostOptionsModal')
  },
  methods: {
    truncate(text) {
      if (text) {
        if (text.length >= 100) {
          return text.substring(0, 100) + '...'
        }
        return text
      }
    },
    likeDislike() {
      if (this.$route.name === 'post-id') {
        this.$axios
          .post(
            '/like/set',
            { post_id: this.$route.params.id, user_id: this.$auth.user.id },
            {
              headers: {
                'content-type': 'application/json'
              }
            }
          )
          .then(response => {
            const { liked, disliked } = response.data
            if (liked) {
              this.$emit('liked')
            } else if (disliked) {
              this.$emit('disliked')
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    deletePost(payload) {
      this.$emit('deletePost', payload)
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