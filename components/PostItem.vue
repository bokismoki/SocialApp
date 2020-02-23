<template>
  <div class="post_item mb-5 border-2 border-gray-300 rounded shadow-big p-5 bg-white">
    <div class="relative">
      <PostAuthor :post="post" :user="user" />
      <PostOptionsModal :post="post" :index="index" @deletePost="deletePost" />
    </div>
    <p v-if="$route.name !== 'post-id'" class="mt-3 break-words">{{truncate(post.body_text)}}</p>
    <p v-else class="mt-3 break-words">{{post.body_text}}</p>
    <img v-if="post.body_image" class="mt-2 rounded" :src="post.body_image" alt="Post image" />
    <div class="flex items-center justify-between mt-5">
      <div class="flex items-center">
        <LikesCount
          :post="post"
          :likes_count="likes_count"
          :index="index"
          @liked="liked"
          @disliked="disliked"
        />
        <CommentsCount :post="post" :comments_count="comments_count" />
      </div>
      <div class="flex items-center">
        <p class="text-xs font-semibold">Share:</p>
        <SocialSharing :post="post" />
      </div>
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
    CommentsCount: () => import('~/components/CommentsCount'),
    SocialSharing: () => import('~/components/SocialSharing')
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
img {
  max-width: 75%;
}
</style>