<template>
  <div class="home">
    <div class="container mx-auto pt-5 pb-16 px-5 max-w-5xl">
      <div class="lg:flex">
        <div class="lg:mr-10 lg:w-1/3 lg:mt-6">
          <Form @newPost="newPost" />
        </div>
        <div class="mt-20 lg:mt-0 lg:w-2/3">
          <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Public Posts</h1>
          <div v-for="post in posts" :key="post.post_id">
            <PostItem :post="post" />
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
    Form: () => import('~/components/Form'),
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
    }
  },
  async asyncData({ $axios }) {
    try {
      const posts = await $axios.get('/post/all_public')
      return {
        posts: posts.data.posts
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
