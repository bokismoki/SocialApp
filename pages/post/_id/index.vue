<template>
  <div class="post">
    <div class="container mx-auto pt-5 pb-16 px-5 lg:max-w-3xl">
      <PostItem
        :post="post"
        :likes_count="likes_count"
        :comments_count="comments.length"
        @liked="liked"
        @disliked="disliked"
      />
      <div class="max-w-lg">
        <div v-if="$auth.user.id !== post.user_id">
          <CommentForm @newComment="comment" />
        </div>
        <div class="mt-10">
          <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Comments</h1>
          <div v-for="comment in comments" :key="comment.comment_id">
            <CommentItem :comment="comment" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Post: ${this.post.post_id}`
    }
  },
  middleware: 'auth',
  components: {
    PostItem: () => import('~/components/PostItem'),
    CommentForm: () => import('~/components/CommentForm'),
    CommentItem: () => import('~/components/CommentItem')
  },
  methods: {
    comment(payload) {
      this.comments.unshift(payload)
    },
    liked() {
      this.likes_count++
    },
    disliked() {
      this.likes_count--
    }
  },
  async asyncData({ $axios, $auth, params, redirect }) {
    try {
      const post = await $axios.get(`/post/by_id/${params.id}`)
      const comments = await $axios.get(`/comment/by_post/${params.id}`)
      const likes = await $axios.get(`/like/by_post/${post.data.post.post_id}`)
      if ($auth.user.id !== post.data.post.user_id) {
        if (post.data.post.is_private === 1) {
          return redirect({ name: 'index' })
        }
      }
      return {
        post: post.data.post,
        comments: comments.data.comments,
        likes_count: likes.data.likes.likes_count
      }
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
.post {
  margin-top: 80px;
}
</style>