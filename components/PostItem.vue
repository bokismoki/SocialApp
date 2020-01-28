<template>
  <div class="post_item mb-5 border-2 border-gray-300 rounded-lg p-5 bg-white">
    <div class="relative">
      <PostAuthor :post="post" :user="user" />
      <PostOptionsModal :post="post" :index="index" @deletePost="deletePost" />
    </div>
    <p v-if="$route.name !== 'post-id'" class="mt-3 break-words">{{truncate(post.body_text)}}</p>
    <p v-else class="mt-3 break-words">{{post.body_text}}</p>
    <img v-if="post.body_image" class="mt-2" :src="post.body_image" alt="Post image" />
    <div class="flex mt-5">
      <LikesCount
        :post="post"
        :likes_count="likes_count"
        :index="index"
        @liked="liked"
        @disliked="disliked"
      />
      <CommentsCount :post="post" :comments_count="comments_count" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: ['post', 'user', 'likes_count', 'comments_count', 'index'],
  components: {
    PostAuthor: () => import('~/components/PostAuthor'),
    PostOptionsModal: () => import('~/components/PostOptionsModal'),
    LikesCount: () => import('~/components/LikesCount'),
    CommentsCount: () => import('~/components/CommentsCount')
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
    deletePost(payload) {
      this.$emit('deletePost', payload)
    },
    liked(payload) {
      this.$emit('liked', payload)
    },
    disliked(payload) {
      this.$emit('disliked', payload)
    }
  }
}
</script>

<style scoped>
</style>