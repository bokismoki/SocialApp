<template>
  <div class="post">
    <div class="container mx-auto pt-5 pb-16 px-5 lg:max-w-3xl">
      <PostItem
        :post="post"
        :likes_count="post.likes_count"
        :comments_count="comments_count"
        @liked="liked"
        @disliked="disliked"
      />
      <div class="max-w-lg">
        <CommentForm @newComment="newComment" />
        <div class="mt-10">
          <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Comments</h1>
          <p v-if="comments.length === 0">No comments to display.</p>
          <div v-else v-for="(comment, index) in comments" :key="comment.comment_id">
            <CommentItem :comment="comment" :index="index" @deleteComment="deleteComment" />
          </div>
        </div>
        <div>
          <button
            class="bg-blue-700 text-white mx-1 px-2 rounded-sm font-semibold"
            :class="{'px-3 py-1': activePaginationIndex === index}"
            v-for="(btn, index) in paginationButtonsCount"
            :key="index"
            @click="updatePagination(index)"
          >{{index + 1}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Post ${this.post.post_id}`
    }
  },
  middleware: 'auth',
  components: {
    PostItem: () => import('~/components/PostItem'),
    CommentForm: () => import('~/components/CommentForm'),
    CommentItem: () => import('~/components/CommentItem')
  },
  data() {
    return {
      activePaginationIndex: 0
    }
  },
  computed: {
    paginationButtonsCount() {
      return Math.ceil(this.comments_count / 10)
    }
  },
  methods: {
    newComment(payload) {
      this.comments.unshift(payload)
    },
    liked() {
      this.post.likes_count++
    },
    disliked() {
      this.post.likes_count--
    },
    deleteComment(payload) {
      this.comments.splice(payload, 1)
    },
    async updatePagination(index) {
      try {
        if (this.activePaginationIndex !== index) {
          this.activePaginationIndex = index
          this.$store.dispatch('setIsLoading', true)
          const comments = await this.$axios.get(
            `/comment/get/by_post/${this.$route.params.id}/${index}`
          )
          
          this.comments = comments.data.comments
          window.scrollTo(0, 0)
          this.$store.dispatch('setIsLoading', false)
        }
      } catch (err) {
        this.$store.dispatch('setErrorMsg', err)
        this.$router.push({ name: 'index' })
        this.$store.dispatch('setIsLoading', false)
      }
    }
  },
  async asyncData({ $axios, $auth, params, redirect, store }) {
    try {
      store.dispatch('setIsLoading', true)
      const post = await $axios.get(`/post/get/by_id/${params.id}`)
      if ($auth.user.id !== post.data.post.user_id) {
        if (post.data.post.is_private === 1) {
          return redirect({ name: 'index' })
        }
      }
      const comments = await $axios.get(`/comment/get/by_post/${params.id}/0`)
      const comments_count = await $axios.get(
        `/comment/get/count/by_post/${params.id}`
      )
      store.dispatch('setIsLoading', false)
      return {
        post: post.data.post,
        comments: comments.data.comments,
        comments_count: comments_count.data.comments_count
      }
    } catch (err) {
      store.dispatch('setErrorMsg', err)
      redirect({ name: 'index' })
      store.dispatch('setIsLoading', false)
    }
  }
}
</script>

<style scoped>
.post {
  margin-top: 80px;
}
</style>