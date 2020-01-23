<template>
  <div class="post_edit">
    <div class="container mx-auto max-w-5xl pt-5 pb-16 px-5">
      <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Post Editing</h1>
      <div class="mb-10">
        <h2 class="uppercase text-gray-800 font-semibold mb-5">Current Post:</h2>
        <div class="flex items-center">
          <img
            class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
            :src="post.image"
            alt="My Facebook profile image"
          />
          <div>
            <h1 class="font-semibold">{{post.first_name}} {{post.last_name}}</h1>
            <div class="flex items-center">
              <p class="font-semibold text-xs mr-2">{{formatDate(post.created_at)}}</p>
              <img
                class="w-4"
                src="~/assets/img/network.svg"
                alt="Gray network icon"
                :class="{'opacity-50': post.is_private}"
              />
            </div>
          </div>
        </div>
        <p class="mt-3">{{post.body_text}}</p>
        <img v-if="post.body_image" class="max-w-xs mt-2" :src="post.body_image" alt="Post image" />
      </div>
      <h2 class="uppercase text-gray-800 font-semibold mb-5">New Content:</h2>
      <div class="max-w-lg">
        <PostForm />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Post Edit ${this.post.post_id}`
    }
  },
  components: {
    PostForm: () => import('~/components/PostForm')
  },
  methods: {
    formatDate(date) {
      if (date) {
        return date.substring(0, 10)
      }
    }
  },
  async asyncData({ $axios, $auth, params, redirect }) {
    try {
      const post = await $axios.get(`/post/get/by_id/${params.id}`)
      if ($auth.user.id !== post.data.post.user_id) {
        return redirect({ name: 'index' })
      }
      return {
        post: post.data.post
      }
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
.post_edit {
  margin-top: 80px;
}
</style>