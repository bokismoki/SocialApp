<template>
  <div class="home">
    <div class="container mx-auto pt-5 pb-16 px-5">
      <div class="max-w-5xl mx-auto lg:flex">
        <div class="lg:mr-10 lg:w-1/3 lg:mt-6">
          <div class="lg:sticky" style="top: 120px;">
            <SearchUser />
            <PostForm @newPost="newPost" />
          </div>
        </div>
        <div class="mt-20 lg:mt-0 lg:w-2/3">
          <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Public Posts</h1>
          <div v-for="(post, index) in posts" :key="post.post_id">
            <PostItem
              :post="post"
              :index="index"
              :likes_count="post.likes_count"
              :comments_count="post.comments_count"
              @liked="liked"
              @disliked="disliked"
              @deletePost="deletePost"
            />
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
    PostItem: () => import('~/components/PostItem'),
    SearchUser: () => import('~/components/SearchUser')
  },
  data() {
    return {
      activePaginationIndex: 0
    }
  },
  computed: {
    paginationButtonsCount() {
      return Math.ceil(this.posts_count / 15)
    }
  },
  methods: {
    newPost(payload) {
      if (payload.is_private === 0) {
        const [first_name, last_name] = this.$auth.user.name.split(' ')
        this.posts.unshift({
          ...payload,
          first_name,
          last_name,
          likes_count: 0,
          comments_count: 0,
          image: this.$auth.user.picture.data.url
            ? this.$auth.user.picture.data.url
            : this.$auth.user.picture
        })
      }
    },
    deletePost(payload) {
      this.posts.splice(payload, 1)
    },
    liked(payload) {
      this.posts[payload].likes_count++
    },
    disliked(payload) {
      this.posts[payload].likes_count--
    },
    async updatePagination(index) {
      try {
        if (this.activePaginationIndex !== index) {
          this.activePaginationIndex = index
          this.$store.dispatch('setIsLoading', true)
          const posts = await this.$axios.get(`/post/get/public/${index}`)
          const posts_count = await this.$axios.get('/post/get/count/public')

          this.posts = posts.data.posts
          this.posts_count = posts_count.data.posts_count
          window.scrollTo(0, 0)
          this.$store.dispatch('setIsLoading', false)
        }
      } catch (err) {
        this.$store.dispatch('setErrorMsg', err)
        this.$store.dispatch('setIsLoading', false)
      }
    }
  },
  async asyncData({ $axios, store }) {
    try {
      store.dispatch('setIsLoading', true)
      const posts = await $axios.get('/post/get/public/0')
      const posts_count = await $axios.get('/post/get/count/public')
      store.dispatch('setIsLoading', false)
      return {
        posts: posts.data.posts,
        posts_count: posts_count.data.posts_count
      }
    } catch (err) {
      store.dispatch('setErrorMsg', err)
      store.dispatch('setIsLoading', false)
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
