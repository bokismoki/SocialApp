<template>
  <div class="home">
    <div class="container mx-auto pt-5 pb-16 px-5">
      <div class="max-w-5xl mx-auto lg:flex">
        <div class="lg:mr-10 lg:w-1/3 lg:mt-6">
          <PostForm @newPost="newPost" />
        </div>
        <div class="mt-20 lg:mt-0 lg:w-2/3">
          <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Public Posts</h1>
          <div v-for="(post, index) in posts" :key="post.post_id">
            <PostItem
              :post="post"
              :index="index"
              :likes_count="likes[index].likes_count"
              :comments_count="comments[index].comments_count"
              @liked="liked"
              @disliked="disliked"
              @deletePost="deletePost"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Home'
  },
  middleware: 'auth',
  components: {
    PostForm: () => import('~/components/PostForm'),
    PostItem: () => import('~/components/PostItem')
  },
  methods: {
    newPost(payload) {
      if (payload.is_private === 0) {
        const [first_name, last_name] = this.$auth.user.name.split(' ')
        this.posts.unshift({
          ...payload,
          first_name,
          last_name,
          image: this.$auth.user.picture.data.url
        })
      }
    },
    deletePost(payload) {
      this.posts.splice(payload, 1)
    },
    liked(payload) {
      this.likes[payload].likes_count++
    },
    disliked(payload) {
      this.likes[payload].likes_count--
    }
  },
  async asyncData({ $axios }) {
    try {
      const posts = await $axios.get('/post/get/public')
      const likes = await $axios.get('/like/get/public')
      const comments = await $axios.get('/comment/get/public')
      return {
        posts: posts.data.posts,
        likes: likes.data.likes,
        comments: comments.data.comments
      }
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.home {
  margin-top: 80px;
}
</style>
